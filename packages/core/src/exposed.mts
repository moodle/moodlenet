import { checkUpdates, install, uninstall, updateAll } from './pkg-mng/lib/npm.mjs'
import { listEntries, pkgEntryByPkgIdValue } from './pkg-registry/lib.mjs'
import { PkgIdentifier } from './types.mjs'
import { InstallPkgReq } from './root-export.mjs'
import { rebootSystem } from './main/sys.mjs'
import { pkgExpose } from './pkg-expose/lib.mjs'

export const expose = await pkgExpose(import.meta)({
  rpc: {
    'active-pkgs/ls': {
      guard: () => void 0,
      fn: async () => {
        const entries = await listEntries()
        return entries
      },
    },
    'active-pkgs/get-by-pkgid': {
      guard: () => void 0,
      fn: async (pkgId: PkgIdentifier) => {
        const entry = await pkgEntryByPkgIdValue(pkgId)
        return entry
      },
    },

    'pkg-mng/install': {
      guard: () => void 0,
      fn: async (pkgs: InstallPkgReq[]) => {
        await install(pkgs)
        rebootSystem()
        return
      },
    },

    'pkg-mng/uninstall': {
      guard: () => void 0,
      fn: async (pkgs: PkgIdentifier[]) => {
        await uninstall(pkgs)
        rebootSystem()
        return
      },
    },

    'pkg-mng/checkUpdates': {
      guard: () => void 0,
      fn: async () => {
        const { updatePkgs } = await checkUpdates()
        return { updatePkgs }
      },
    },

    'pkg-mng/updateAll': {
      guard: () => void 0,
      fn: async () => {
        const { updatePkgs } = await updateAll()
        if (Object.keys(updatePkgs).length) {
          rebootSystem()
        }
        return { updatePkgs }
      },
    },

    'rebootSystem': {
      guard: () => void 0,
      fn: async () => {
        rebootSystem()
        return
      },
    },
  },
} as const)
