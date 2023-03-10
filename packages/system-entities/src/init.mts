import { getMyDB } from '@moodlenet/arangodb/server'
import { shell } from './shell.mjs'

export const { db } = await shell.call(getMyDB)()

// export const EntitiesView = (await db.view('EntitiesView').exists())
//   ? await db.view('EntitiesView')
//   : await db.createView('EntitiesView', { type: 'search-alias', indexes: [] })

export const env = getEnv(shell.config)
function getEnv(_: any): Env {
  const rootPassword = 'string' === typeof _?.rootPassword ? _.rootPassword : undefined
  return {
    rootPassword,
  }
}
export type Env = { rootPassword?: string }
