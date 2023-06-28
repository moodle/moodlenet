import { getMyShell } from '@moodlenet/core'
import type { PkgEvents } from './types.mjs'
import type { SysEntitiesAsyncCtxType } from './types.private.mjs'

export const shell = await getMyShell<SysEntitiesAsyncCtxType, PkgEvents>(import.meta)
