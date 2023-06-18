import { getMyShell } from '@moodlenet/core'
import type { WebUserCtxType, WebUserEvents } from './types.mjs'

export const shell = await getMyShell<WebUserCtxType, WebUserEvents>(import.meta)
