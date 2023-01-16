import { getRootSessionToken, getClientSession } from './lib.mjs'
import shell from './shell.mjs'

export const expose = await shell.expose({
  rpc: {
    getClientSession: {
      guard: () => void 0,
      fn: getClientSession,
    },
    getRootSessionToken: {
      guard: () => void 0,
      fn: getRootSessionToken,
    },
  },
})
