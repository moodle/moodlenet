import { npmRegistry } from '@moodlenet/core'
import { ExtMngrExposeType } from '../common/expose-def.mjs'
import { install, listDeployed, searchPackages, uninstall } from './lib.mjs'
import { shell } from './shell.mjs'

export const expose = await shell.expose<ExtMngrExposeType>({
  rpc: {
    searchPackages: {
      guard: () => void 0,
      async fn({ searchText }) {
        return searchPackages({
          searchText,
        })
      },
    },
    listDeployed: {
      guard: () => void 0,
      async fn() {
        const pkgInfos = await listDeployed()
        return { pkgInfos }
      },
    },
    uninstall: {
      guard: () => void 0,
      async fn(pkgIds) {
        await uninstall(pkgIds)
      },
    },
    install: {
      guard: () => void 0,
      async fn(installPkgReqs) {
        await install(installPkgReqs)
      },
    },
    getDefaultRegistry: {
      guard: () => void 0,
      async fn() {
        return npmRegistry
      },
    },
  },
})
