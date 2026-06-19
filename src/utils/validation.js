import { isFutureDate } from './dates'

export function validateLetterInput({ title, content, openDate }) {
  if (!title.trim()) return 'Add a title before sealing.'
  if (!content.trim()) return 'Write the letter before sealing.'
  if (!openDate) return 'Choose an open date.'
  if (!isFutureDate(openDate)) return 'Choose a future open date.'
  return ''
}

export function normalizeImportedLetters(value) {
  const letters = Array.isArray(value?.letters) ? value.letters : Array.isArray(value) ? value : null

  if (!letters) {
    throw new Error('Import file does not contain letters.')
  }

  return letters.map((letter) => {
    if (!letter.id || !letter.title || !letter.content || !letter.openDate || !letter.writtenAt) {
      throw new Error('Import file contains an invalid letter.')
    }

    const writtenAt = toValidIso(letter.writtenAt)
    const openDate = toValidIso(letter.openDate)
    const openedAt = letter.openedAt ? toValidIso(letter.openedAt) : null
    const createdAt = letter.createdAt ? toValidIso(letter.createdAt) : writtenAt
    const updatedAt = letter.updatedAt ? toValidIso(letter.updatedAt) : openedAt || createdAt

    return {
      id: String(letter.id),
      title: String(letter.title),
      content: String(letter.content),
      writtenAt,
      openDate,
      openedAt,
      createdAt,
      updatedAt,
      cloudId: letter.cloudId ? String(letter.cloudId) : null,
      emailReminder: letter.emailReminder ? String(letter.emailReminder) : null,
    }
  })
}

function toValidIso(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new Error('Import file contains an invalid date.')
  }
  return date.toISOString()
}
