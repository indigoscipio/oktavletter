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

  function createLetter({ title, content, openDate, cloudId = null, emailReminder = null, key = null }) {
    const now = new Date().toISOString()
    const letter = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: cloudId ? '' : content.trim(),
      writtenAt: now,
      openDate: dateInputToIso(openDate),
      openedAt: null,
      createdAt: now,
      updatedAt: now,
      cloudId,
      emailReminder,
      key,
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
    const merged = new Map(letters.map((letter) => [letter.id, letter]))
    const result = { added: 0, updated: 0, skipped: 0 }

    normalized.forEach((letter) => {
      const existing = merged.get(letter.id)
      if (!existing) {
        merged.set(letter.id, letter)
        result.added += 1
        return
      }

      if (new Date(letter.updatedAt) > new Date(existing.updatedAt)) {
        merged.set(letter.id, letter)
        result.updated += 1
      } else {
        result.skipped += 1
      }
    })

    setLetters([...merged.values()])
    return result
  }

  function deleteLetter(id) {
    setLetters((current) => current.filter((letter) => letter.id !== id))
  }

  function exportLetters() {
    downloadJson('algernon-backup.json', buildExportPayload(letters))
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
    findLetter,
  }
}
