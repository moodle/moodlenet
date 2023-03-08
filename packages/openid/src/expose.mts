import { shell } from './shell.mjs'

export const expose = await shell.expose({
  rpc: {
    // getCurrentClientSession: {
    //   guard: () => void 0,
    //   fn: getCurrentClientSession,
    // }
  },
})
