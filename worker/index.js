const JSON_HEADERS = { 'content-type': 'application/json' }

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(request, env) })
    }

    const url = new URL(request.url)

    try {
      if (request.method === 'POST' && url.pathname === '/api/letters') {
        return withCors(await createLetter(request, env), request, env)
      }

      const match = url.pathname.match(/^\/api\/letters\/([^/]+)$/)
      if (request.method === 'GET' && match) {
        return withCors(await getLetter(match[1], env), request, env)
      }

      return withCors(json({ error: 'Not found' }, 404), request, env)
    } catch (error) {
      return withCors(json({ error: error.message || 'Server error' }, 500), request, env)
    }
  },

  async scheduled(_event, env) {
    await sendDueReminders(env)
  },
}

async function createLetter(request, env) {
  const body = await request.json()
  const email = String(body.email || '').trim().toLowerCase()
  const openDate = String(body.openDate || '')
  const encryptedPayload = String(body.encryptedPayload || '')
  const salt = String(body.salt || '')
  const iv = String(body.iv || '')

  if (!email.includes('@')) return json({ error: 'Enter a valid email.' }, 400)
  if (!isFutureDate(openDate)) return json({ error: 'Choose a future open date.' }, 400)
  if (!encryptedPayload || !salt || !iv) return json({ error: 'Missing encrypted letter data.' }, 400)

  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()

  await env.DB.prepare(
    `INSERT INTO letters (id, email, open_date, encrypted_payload, salt, iv, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, email, openDate, encryptedPayload, salt, iv, createdAt)
    .run()

  return json({ id, openDate })
}

async function getLetter(id, env) {
  const letter = await env.DB.prepare(
    `SELECT id, open_date, encrypted_payload, salt, iv, created_at
     FROM letters WHERE id = ?`,
  )
    .bind(id)
    .first()

  if (!letter) return json({ error: 'Letter not found.' }, 404)

  if (new Date(letter.open_date) > new Date()) {
    return json({ status: 'waiting', openDate: letter.open_date })
  }

  return json({
    status: 'ready',
    id: letter.id,
    openDate: letter.open_date,
    encryptedPayload: letter.encrypted_payload,
    salt: letter.salt,
    iv: letter.iv,
    createdAt: letter.created_at,
  })
}

async function sendDueReminders(env) {
  const due = await env.DB.prepare(
    `SELECT id, email, open_date
     FROM letters
     WHERE reminder_sent_at IS NULL AND date(open_date) <= date('now')
     ORDER BY open_date ASC
     LIMIT 100`,
  ).all()

  for (const letter of due.results || []) {
    const sent = await sendReminderEmail(letter, env)
    if (sent) {
      await env.DB.prepare('UPDATE letters SET reminder_sent_at = ? WHERE id = ?')
        .bind(new Date().toISOString(), letter.id)
        .run()
    }
  }
}

async function sendReminderEmail(letter, env) {
  if (!env.RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY; reminder not sent.', { letterId: letter.id })
    return false
  }

  const link = `${env.APP_URL}?letter=${encodeURIComponent(letter.id)}`
  const text = [
    'Hello,',
    '',
    'A letter you sealed in Algernon is ready to open.',
    '',
    'Open your letter:',
    link,
    '',
    'You will need your unlock phrase to read it. Algernon cannot recover the phrase or read your letter.',
    '',
    'Oktav Software',
  ].join('\n')
  const html = `
    <p>Hello,</p>
    <p>A letter you sealed in Algernon is ready to open.</p>
    <p><a href="${link}">Open your letter</a></p>
    <p>You will need your unlock phrase to read it. Algernon cannot recover the phrase or read your letter.</p>
    <p>Oktav Software</p>
  `
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: letter.email,
      subject: 'Your Algernon letter is ready',
      text,
      html,
    }),
  })

  if (!response.ok) {
    console.error('Resend reminder failed.', {
      letterId: letter.id,
      status: response.status,
      body: await response.text(),
    })
    return false
  }

  return true
}

function isFutureDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  return date > today
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS })
}

function withCors(response, request, env) {
  const headers = new Headers(response.headers)
  Object.entries(corsHeaders(request, env)).forEach(([key, value]) => headers.set(key, value))
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}

function corsHeaders(request, env) {
  const origin = request.headers.get('origin')
  const allowedOrigins = String(env.ALLOWED_ORIGINS || env.ALLOWED_ORIGIN || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || '*'

  return {
    'access-control-allow-origin': allowedOrigin,
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type',
  }
}
