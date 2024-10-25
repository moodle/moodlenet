import { stat, writeFile } from 'fs/promises'
import { resolve } from 'path'
import { Collection_v3v2_IdMapping, user_collections } from './init/collections.mjs'
import { featured_entities } from './init/featured-entities.mjs'
import { organization } from './init/organizaton.mjs'
import { Resource_v3v2_IdMapping, user_resources } from './init/resources.mjs'
import {
  EmailUser_v3v2_IdMapping,
  Profile_v3v2_IdMapping,
  user_profiles,
} from './init/web-users.mjs'
import { shell } from './shell.mjs'

const migration_done_file = resolve(shell.baseFsFolder, 'migration_done')
const migration_done = await stat(migration_done_file).catch(() => undefined)
if (!migration_done) {
  console.time('migration done in')
  await organization()
  await user_profiles()
  await user_resources()
  await user_collections()
  await featured_entities()
  console.timeEnd('migration done in')
  await writeFile(
    migration_done_file,
    JSON.stringify(
      {
        at: new Date().toISOString(),
        Collection_v3v2_IdMapping,
        Resource_v3v2_IdMapping,
        EmailUser_v3v2_IdMapping,
        Profile_v3v2_IdMapping,
      },
      null,
      2,
    ),
    'utf-8',
  )
}
