import { getMyShell } from '@moodlenet/core'
import type { OpenIDAsyncCtx } from './types/asyncCtxTypes.mjs'

export const shell = await getMyShell<OpenIDAsyncCtx>(import.meta)
