import { getMyShell } from '@moodlenet/core'
import '@moodlenet/ed-resource/server'
import type { WebUserCtxType, WebUserEvents } from './types.mjs'

export const shell = await getMyShell<WebUserCtxType, WebUserEvents>(import.meta)
