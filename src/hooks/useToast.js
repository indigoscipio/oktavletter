import { useRef, useState } from 'react'

export function useToast() {
  const [toast, setToast] = useState('')
  const timeoutRef = useRef(null)

  function showToast(message) {
    setToast(message)
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setToast(''), 4000)
  }

  return { toast, showToast }
}
