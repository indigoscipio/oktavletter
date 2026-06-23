import { useState } from 'react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Toast from './components/Toast'
import { useDarkMode } from './hooks/useDarkMode'
import { useLetters } from './hooks/useLetters'
import { useToast } from './hooks/useToast'
import CloudLetter from './screens/CloudLetter'
import LetterDetail from './screens/LetterDetail'
import Letters from './screens/Letters'
import SealComplete from './screens/SealComplete'
import Settings from './screens/Settings'
import Write from './screens/Write'

export default function App() {
  const initialCloudLetterId = new URLSearchParams(window.location.search).get('letter')
  const [view, setView] = useState(initialCloudLetterId ? 'cloud' : 'letters')
  const [cloudLetterId, setCloudLetterId] = useState(initialCloudLetterId)
  const [selectedLetterId, setSelectedLetterId] = useState(null)
  const [dark, setDark] = useDarkMode()
  const letters = useLetters()
  const { toast, showToast } = useToast()

  const showHeader = view !== 'cloud'

  function renderView() {
    if (view === 'write') {
      return (
        <Write
          createLetter={letters.createLetter}
          setView={setView}
          setSelectedLetterId={setSelectedLetterId}
          showToast={showToast}
        />
      )
    }

    if (view === 'settings') {
      return (
        <Settings
          dark={dark}
          setDark={setDark}
          exportLetters={letters.exportLetters}
          importLetters={letters.importLetters}
          showToast={showToast}
        />
      )
    }

    if (view === 'sealed') {
      return <SealComplete letter={letters.findLetter(selectedLetterId)} setView={setView} />
    }

    if (view === 'detail') {
      return (
        <LetterDetail
          letter={letters.findLetter(selectedLetterId)}
          openLetter={letters.openLetter}
          deleteLetter={letters.deleteLetter}
          setView={setView}
          showToast={showToast}
        />
      )
    }

    if (view === 'cloud') {
      const localLetter = letters.letters.find((l) => l.cloudId === cloudLetterId)
      return (
        <CloudLetter
          cloudLetterId={cloudLetterId}
          setView={setView}
          showToast={showToast}
          openLetter={letters.openLetter}
          localLetterId={localLetter?.id || null}
        />
      )
    }

    return (
      <Letters
        letters={letters.letters}
        setView={setView}
        setSelectedLetterId={setSelectedLetterId}
        setCloudLetterId={setCloudLetterId}
      />
    )
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="mx-auto max-w-xl px-4 py-6">
        {showHeader && <Header setView={setView} />}
        {renderView()}
      </div>
      <Navigation view={view} setView={setView} />
      <Toast message={toast} />
    </div>
  )
}
