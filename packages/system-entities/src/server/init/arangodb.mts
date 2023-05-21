import { getMyDB } from '@moodlenet/arangodb/server'
import { shell } from '../shell.mjs'

export const { db } = await shell.call(getMyDB)()
