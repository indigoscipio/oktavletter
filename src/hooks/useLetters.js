import { useEffect, useMemo, useState } from 'react'
import { dateInputToIso } from '../utils/dates'
import { buildExportPayload, downloadJson } from '../utils/export'
import { normalizeImportedLetters } from '../utils/validation'

const STORAGE_KEY = 'algernon_letters'

function loadLetters() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? normalizeImportedLetters(JSON.parse(stored)) : []
  } catch {
    return []
  }
}

export function useLetters() {
  const [letters, setLetters] = useState(loadLetters)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(letters))
  }, [letters])

  const sortedLetters = useMemo(() => {
    return [...letters].sort((a, b) => new Date(a.openDate) - new Date(b.openDate))
  }, [letters])

  function createLetter({ title, content, openDate, cloudId = null, emailReminder = null }) {
    const now = new Date().toISOString()
    const letter = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      writtenAt: now,
      openDate: dateInputToIso(openDate),
      openedAt: null,
      createdAt: now,
      updatedAt: now,
      cloudId,
      emailReminder,
    }

    setLetters((current) => [letter, ...current])
    return letter
  }

  function openLetter(id) {
    const now = new Date().toISOString()
    setLetters((current) =>
      current.map((letter) =>
        letter.id === id && !letter.openedAt ? { ...letter, openedAt: now, updatedAt: now } : letter,
      ),
    )
  }

  function importLetters(importedLetters) {
    const normalized = normalizeImportedLetters(importedLetters)
    let added = 0
    let updated = 0
    let skipped = 0

    setLetters((current) => {
      const merged = new Map(current.map((letter) => [letter.id, letter]))

      normalized.forEach((letter) => {
        const existing = merged.get(letter.id)
        if (!existing) {
          merged.set(letter.id, letter)
          added += 1
          return
        }

        if (new Date(letter.updatedAt) > new Date(existing.updatedAt)) {
          merged.set(letter.id, letter)
          updated += 1
        } else {
          skipped += 1
        }
      })

      return [...merged.values()]
    })

    return { added, updated, skipped }
  }

  function deleteLetter(id) {
    setLetters((current) => current.filter((letter) => letter.id !== id))
  }

  function exportLetters() {
    downloadJson('algernon-backup.json', buildExportPayload(letters))
  }

  function exportBackupFor(letter) {
    downloadJson(`algernon-backup-${letter.id}.json`, buildExportPayload([letter, ...letters]))
  }

  function findLetter(id) {
    return letters.find((letter) => letter.id === id)
  }

  return {
    letters: sortedLetters,
    createLetter,
    openLetter,
    deleteLetter,
    importLetters,
    exportLetters,
    exportBackupFor,
    findLetter,
  }
}
