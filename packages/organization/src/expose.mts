import { getOrgData, setOrgData } from './lib.mjs'
import shell from './shell.mjs'

export const expose = await shell.expose({
  rpc: {
    setOrgData: {
      guard: () => void 0,
      fn: setOrgData,
    },
    getOrgData: {
      guard: () => void 0,
      fn: getOrgData,
    },
  },
})
