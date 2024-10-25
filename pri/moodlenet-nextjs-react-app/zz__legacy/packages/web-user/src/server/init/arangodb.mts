import { ensureDocumentCollection, getMyDB } from '@moodlenet/arangodb/server'
import { shell } from '../shell.mjs'
import type { ActivityLogDataType, WebUserDataType } from '../types.mjs'

export const { db } = await shell.call(getMyDB)()
export const { collection: WebUserCollection /* ,newlyCreated */ } = await shell.call(
  ensureDocumentCollection<WebUserDataType>,
)('WebUser')
export const { collection: ActivityLogCollection /* ,newlyCreated */ } = await shell.call(
  ensureDocumentCollection<ActivityLogDataType>,
)('ActivityLog')
