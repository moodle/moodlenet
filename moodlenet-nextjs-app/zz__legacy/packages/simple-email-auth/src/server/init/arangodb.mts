import { ensureDocumentCollection, getMyDB } from '@moodlenet/arangodb/server'
import { shell } from '../shell.mjs'
import type { EmailPwdUserData } from '../store/types.mjs'

export const { db } = await shell.call(getMyDB)()
export const { collection: EmailPwdUserCollection /* ,newlyCreated */ } =
  await shell.call(ensureDocumentCollection)<EmailPwdUserData>('EmailPwdUser')
