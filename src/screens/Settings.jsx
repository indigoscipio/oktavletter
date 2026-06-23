import { useState } from 'react'
import { ChevronDown, Download, Upload } from 'lucide-react'
import { readJsonFile } from '../utils/export'
import Toggle from '../components/ui/Toggle'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function Settings({ dark, setDark, exportLetters, importLetters, showToast }) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  async function handleImport(event) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const json = await readJsonFile(file)
      const result = importLetters(json)
      const total = result.added + result.updated
      showToast(`Imported successfully. ${total} letter${total === 1 ? '' : 's'} added or updated.`)
    } catch (error) {
      showToast(error.message)
    } finally {
      event.target.value = ''
    }
  }

  return (
    <main className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Settings</h1>
      </header>

      <Card className="space-y-2">
        <h2 className="text-lg font-medium text-[var(--text-primary)]">About</h2>
        <p className="text-sm leading-6 text-[var(--text-secondary)]">
          No accounts. Your letter is encrypted before upload. Only your unique link can open it.
        </p>
      </Card>

      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 text-left"
        >
          <span className="text-lg font-medium text-[var(--text-primary)]">Advanced</span>
          <ChevronDown
            size={20}
            className={`text-[var(--text-muted)] transition-transform duration-200 ${
              showAdvanced ? 'rotate-180' : ''
            }`}
          />
        </button>
        {showAdvanced && (
          <div className="mt-2 space-y-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Export or import your letters as a JSON file. Backups contain your letter
              content, so store them securely.
            </p>
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Download size={14} />}
                onClick={exportLetters}
              >
                Export
              </Button>
              <label className="inline-flex cursor-pointer">
                <input
                  type="file"
                  accept="application/json,.json"
                  onChange={handleImport}
                  className="hidden"
                />
                <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] transition-colors duration-150 hover:bg-[var(--bg-elevated)]">
                  <Upload size={16} />
                  Import
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      <Card className="space-y-2">
        <h2 className="text-lg font-medium text-[var(--text-primary)]">Appearance</h2>
        <Toggle
          checked={dark}
          onChange={setDark}
          label="Dark Mode"
          labelClassName="text-sm"
        />
      </Card>

      <p className="text-center text-xs text-[var(--text-muted)]">
        algernon v2.0 · No accounts · Encrypted letters · Private reminders
      </p>
    </main>
  )
}
