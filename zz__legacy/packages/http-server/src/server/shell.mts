import { getMyShell } from '@moodlenet/core'
import type { HttpAsyncCtx } from './types.mjs'

export const shell = await getMyShell<HttpAsyncCtx>(import.meta)
