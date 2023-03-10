import { getMyShell } from '@moodlenet/core'
import { AuthAsyncCtx } from './types.mjs'

export const shell = await getMyShell<AuthAsyncCtx>(import.meta)
