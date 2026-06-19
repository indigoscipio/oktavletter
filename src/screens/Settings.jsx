import { readJsonFile } from '../utils/export'

export default function Settings({ exportLetters, importLetters, showToast }) {
  async function handleImport(event) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const json = await readJsonFile(file)
      const result = importLetters(json)
      showToast(`Import complete. Added ${result.added}, updated ${result.updated}, skipped ${result.skipped}.`)
    } catch (error) {
      showToast(error.message)
    } finally {
      event.target.value = ''
    }
  }

  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl text-ink">Settings</h1>
        <p className="text-stone">Algernon emails you when your letters are ready.</p>
      </header>

      <section className="space-y-2 rounded-xl border border-black/10 bg-white p-4">
        <h2 className="text-xl text-ink">About</h2>
        <p className="text-sm leading-6 text-stone">
          No accounts. Your letter is encrypted in the browser before upload. We can email the link when it opens, but
          we cannot read or recover the letter without your unlock phrase.
        </p>
      </section>

      <details className="rounded-xl border border-black/10 bg-white p-4">
        <summary className="cursor-pointer text-xl text-ink">Advanced</summary>
        <div className="mt-4 space-y-3">
          <p className="text-sm text-stone">
            Export or import the local copy stored in this browser. JSON backups contain letter content, so keep them
            private.
          </p>
          <button type="button" onClick={exportLetters} className="rounded-full bg-amber px-4 py-2 text-sm text-ink">
            Export local JSON
          </button>
          <label className="block text-sm text-stone">
            Import local JSON
            <input type="file" accept="application/json,.json" onChange={handleImport} className="mt-2 block w-full text-sm" />
          </label>
        </div>
      </details>
    </main>
  )
}
