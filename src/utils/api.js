const API_BASE = import.meta.env.VITE_API_BASE || ''

export async function createCloudLetter(payload) {
  try {
    const response = await fetch(`${API_BASE}/api/letters`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })

    return readResponse(response)
  } catch {
    throw new Error('Could not reach Algernon email delivery. Check the API setup and try again.')
  }
}

export async function getCloudLetter(id) {
  try {
    const response = await fetch(`${API_BASE}/api/letters/${encodeURIComponent(id)}`)
    return readResponse(response)
  } catch {
    throw new Error('Could not reach Algernon email delivery. Try again later.')
  }
}

async function readResponse(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || 'Request failed.')
  }
  return data
}
