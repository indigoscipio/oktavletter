import { useEffect, useState } from 'react'

const STORAGE_KEY = 'algernon_dark_mode'

function getInitialMode() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function useDarkMode() {
  const [dark, setDark] = useState(getInitialMode)

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      localStorage.setItem(STORAGE_KEY, String(dark))
    } catch {}
  }, [dark])

  return [dark, setDark]
}
