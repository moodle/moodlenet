import { getCurrentClientSession, getRootSessionToken } from './lib.mjs'
import shell from './shell.mjs'

export const expose = await shell.expose({
  rpc: {
    getCurrentClientSession: {
      guard: () => void 0,
      fn: getCurrentClientSession,
    },
    getRootSessionToken: {
      guard: () => void 0,
      fn: getRootSessionToken,
    },
  },
})
