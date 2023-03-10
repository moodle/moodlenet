import { ensureDocumentCollection, getMyDB } from '@moodlenet/arangodb/server'
import { shell } from './shell.mjs'
import { UserData } from './types.mjs'

export const { db } = await shell.call(getMyDB)()

export const USER_COLLECTION_NAME = 'User'
export const { collection: UserCollection, newlyCreated } = await shell.call(
  ensureDocumentCollection,
)<UserData>(USER_COLLECTION_NAME)
