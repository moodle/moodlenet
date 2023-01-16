import { shell } from '@moodlenet/core'
import { AuthAsyncCtx } from './types.mjs'

export default await shell<AuthAsyncCtx>(import.meta)
