import type { PkgExposeImpl } from '@moodlenet/core'
import { npm } from '@moodlenet/core'
import { getOrgData, setOrgData } from '@moodlenet/organization/server'
import type { ReactAppExposeType } from '../common/expose-def.mjs'
import { getAppearance, setAppearance } from './lib.mjs'
import { shell } from './shell.mjs'

const reactAppExposeImpl: PkgExposeImpl<ReactAppExposeType> = {
  rpc: {
    getOrgData: {
      guard: () => void 0,
      fn: getOrgData,
    },
    setOrgData: {
      guard: () => void 0,
      fn: setOrgData,
    },
    getAppearance: {
      guard: () => void 0,
      fn: getAppearance,
    },
    setAppearance: {
      guard: () => void 0,
      fn: setAppearance,
    },
    updateAllPkgs: {
      guard: () => void 0,
      fn: () => npm.updateAll(),
    },
  },
}

export const expose = await shell.expose(reactAppExposeImpl)
