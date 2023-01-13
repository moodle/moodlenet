import { pkgShell } from '@moodlenet/core'
import { AuthAsyncCtx } from './types.mjs'

export default await pkgShell<AuthAsyncCtx>(import.meta)
