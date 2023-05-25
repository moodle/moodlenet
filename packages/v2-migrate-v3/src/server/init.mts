import { stat, writeFile } from 'fs/promises'
import { resolve } from 'path'
import { shell } from './shell.mjs'

const migration_done_file = resolve(shell.baseFsFolder, 'migration_done')
const migration_done = await stat(migration_done_file).catch(() => undefined)
if (!migration_done) {
  await import('./init/organizaton.mjs')
  await import('./init/create-web-users.mjs')
}

await writeFile(migration_done_file, '', 'utf-8')
