import { stat, writeFile } from 'fs/promises'
import { resolve } from 'path'
import { user_collections } from './init/collections.mjs'
import { organization } from './init/organizaton.mjs'
import { user_resources } from './init/resources.mjs'
import { user_profiles } from './init/web-users.mjs'
import { shell } from './shell.mjs'

const migration_done_file = resolve(shell.baseFsFolder, 'migration_done')
const migration_done = await stat(migration_done_file).catch(() => undefined)
if (!migration_done) {
  await organization()
  await user_profiles()
  await user_resources()
  await user_collections()
}

await writeFile(migration_done_file, '', 'utf-8')
