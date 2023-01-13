import { getRootSessionToken } from './lib.mjs'
import { getClientSession } from './pub-lib.mjs'
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
