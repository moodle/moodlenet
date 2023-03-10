import { getMyShell } from '@moodlenet/core'
// import { CryptoAsyncCtx } from './types.mjs'

export const shell = await getMyShell(/* <CryptoAsyncCtx> */ import.meta)
