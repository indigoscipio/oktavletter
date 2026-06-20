import { useState } from 'react'
import Navigation from './components/Navigation'
import Toast from './components/Toast'
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
  const letters = useLetters()
  const { toast, showToast } = useToast()

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
      return <Settings exportLetters={letters.exportLetters} importLetters={letters.importLetters} showToast={showToast} />
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
      return <CloudLetter cloudLetterId={cloudLetterId} setView={setView} showToast={showToast} />
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
    <div className="min-h-screen pb-28">
      <div className="mx-auto max-w-xl px-4 py-8">{renderView()}</div>
      <Navigation view={view} setView={setView} />
      <Toast message={toast} />
    </div>
  )
}
