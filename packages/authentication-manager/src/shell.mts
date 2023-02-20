import { getMyShell } from '@moodlenet/core'
import { AuthAsyncCtx } from './types/sessionTypes.mjs'

export const shell = await getMyShell<AuthAsyncCtx>(import.meta)
