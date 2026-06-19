import { copyFileSync, cpSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const dist = join(root, 'dist')
const landing = join(root, 'landing', 'index.html')
const publicDir = join(root, 'public')

mkdirSync(dist, { recursive: true })
copyFileSync(landing, join(dist, 'index.html'))

if (existsSync(publicDir)) {
  cpSync(publicDir, dist, { recursive: true })
}
