import { npm } from '@moodlenet/core'
import { getAppearance, setAppearance } from './lib.mjs'
import shell from './shell.mjs'

export const expose = await shell.expose({
  rpc: {
    'getAppearance': {
      guard: () => void 0,
      fn: getAppearance,
    },
    'setAppearance': {
      guard: () => void 0,
      fn: setAppearance,
    },
    'remove-me/updateAllPkgs': {
      guard: () => void 0,
      fn: () => npm.updateAll(),
    },
  },
})
