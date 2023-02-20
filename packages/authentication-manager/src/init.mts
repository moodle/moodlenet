import { ensureDocumentCollection, getMyDB } from '@moodlenet/arangodb/server'
import { shell } from './shell.mjs'
import { UserData } from './types/sessionTypes.mjs'

export const env = getEnv(shell.config)

export const { db } = await shell.call(getMyDB)()

export const USER_COLLECTION_NAME = 'User'
export const { collection: UserCollection, newlyCreated } = await shell.call(
  ensureDocumentCollection,
)<UserData>(USER_COLLECTION_NAME)

export * from './lib.mjs'
export * from './types/sessionTypes.mjs'

function getEnv(_: any): Env {
  const rootPassword = 'string' === typeof _?.rootPassword ? _.rootPassword : undefined
  return {
    rootPassword,
  }
}
export type Env = { rootPassword?: string }
