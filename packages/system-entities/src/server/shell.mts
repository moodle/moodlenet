import { getMyShell } from '@moodlenet/core'
import { SysEntitiesAsyncCtxType } from './types.private.mjs'

export const shell = await getMyShell<SysEntitiesAsyncCtxType>(import.meta)
