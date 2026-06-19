import { CalendarPlus, Download, List } from 'lucide-react'
import { formatDate } from '../utils/dates'
import { buildGoogleCalendarUrl, downloadCalendarReminder } from '../utils/ics'

export default function SealComplete({ letter, exportBackupFor, setView, showToast }) {
  if (!letter) {
    return (
      <main className="space-y-4">
        <p className="text-stone">Letter not found.</p>
        <button type="button" onClick={() => setView('letters')} className="text-amber">
          Back to letters
        </button>
      </main>
    )
  }

  function addToGoogleCalendar() {
    window.open(buildGoogleCalendarUrl(letter), '_blank', 'noopener,noreferrer')
  }

  function downloadCalendarFile() {
    downloadCalendarReminder(letter)
    showToast('Calendar file downloaded.')
  }

  function downloadBackup() {
    exportBackupFor(letter)
    showToast('Backup downloaded. Keep it somewhere private.')
  }

  return (
    <main className="space-y-6">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-stone">Sealed</p>
        <h1 className="text-3xl text-ink">Your letter is sealed.</h1>
        {letter.cloudId ? (
          <p className="text-stone">
            It opens on {formatDate(letter.openDate)}. We will email {letter.emailReminder} when it is ready.
          </p>
        ) : (
          <p className="text-stone">
            It opens on {formatDate(letter.openDate)}. It is stored only in this browser unless you download a backup.
          </p>
        )}
      </header>

      {letter.cloudId ? (
        <section className="space-y-3 rounded-xl border border-black/10 bg-white p-4">
          <h2 className="text-xl text-ink">Remember your unlock phrase</h2>
          <p className="text-sm leading-6 text-stone">It is the only way to open this letter.</p>

          <button
            type="button"
            onClick={() => setView('letters')}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-amber px-4 py-3 text-ink"
          >
            <List size={18} />
            Back to letters
          </button>
        </section>
      ) : (
        <>
          <section className="space-y-3 rounded-xl border border-black/10 bg-white p-4">
            <h2 className="text-xl text-ink">Backup</h2>
            <p className="text-sm leading-6 text-stone">
              A backup lets you restore your letters if you change devices or lose browser data. It contains your letter
              content, so keep it private.
            </p>

            <button
              type="button"
              onClick={downloadBackup}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-amber px-4 py-3 text-ink"
            >
              <Download size={18} />
              Download backup
            </button>
          </section>

          <section className="space-y-3 rounded-xl border border-black/10 bg-white p-4">
            <h2 className="text-xl text-ink">Reminder</h2>
            <p className="text-sm leading-6 text-stone">
              Calendar reminders do not include your letter content. They only include a title, date, and link to Algernon.
            </p>

            <button
              type="button"
              onClick={addToGoogleCalendar}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-black/10 px-4 py-3 text-ink"
            >
              <CalendarPlus size={18} />
              Add to Google Calendar
            </button>

            <button
              type="button"
              onClick={downloadCalendarFile}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-black/10 px-4 py-3 text-ink"
            >
              <Download size={18} />
              Download calendar file
            </button>

            <button
              type="button"
              onClick={() => setView('letters')}
              className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-stone"
            >
              <List size={18} />
              Skip for now
            </button>
          </section>
        </>
      )}
    </main>
  )
}
