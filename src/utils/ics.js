import { downloadBlob } from './export'

function escapeIcsText(value) {
  return String(value)
    .replaceAll('\\', '\\\\')
    .replaceAll(';', '\\;')
    .replaceAll(',', '\\,')
    .replaceAll('\n', '\\n')
}

function formatIcsDate(value) {
  return new Date(value).toISOString().slice(0, 10).replaceAll('-', '')
}

function formatGoogleDate(value) {
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

function addDays(value, days) {
  const date = new Date(value)
  date.setDate(date.getDate() + days)
  return date
}

export function buildGoogleCalendarUrl(letter) {
  const start = formatGoogleDate(letter.openDate)
  const end = formatGoogleDate(addDays(letter.openDate, 1))
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Open your Algernon letter',
    dates: `${start}/${end}`,
    details: 'A letter is ready in Algernon. https://algernon.oktavsoftware.com/app/',
    location: 'https://algernon.oktavsoftware.com/app/',
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function downloadCalendarReminder(letter) {
  const date = formatIcsDate(letter.openDate)
  const appUrl = 'https://algernon.oktavsoftware.com/app/'
  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Oktav Software//Algernon//EN',
    'BEGIN:VEVENT',
    `UID:${letter.id}@algernon.oktavsoftware.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART;VALUE=DATE:${date}`,
    `SUMMARY:${escapeIcsText('Open your Algernon letter')}`,
    `DESCRIPTION:${escapeIcsText(`A letter is ready in Algernon. ${appUrl}`)}`,
    `URL:${appUrl}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  downloadBlob(`algernon-${letter.id}.ics`, blob)
}
