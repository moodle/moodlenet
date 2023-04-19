import { getMyShell } from '@moodlenet/core'
import { WebUserCtxType } from './types.mjs'

export const shell = await getMyShell<WebUserCtxType>(import.meta)
