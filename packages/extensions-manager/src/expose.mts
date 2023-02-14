import { InstallPkgReq, npmRegistry, PkgIdentifier } from '@moodlenet/core'
import { install, listDeployed, searchPackages, uninstall } from './lib.mjs'
import shell from './shell.mjs'
import { DeployedPkgInfo, SearchPackagesResponse } from './types/data.mjs'

export const expose = await shell.expose({
  rpc: {
    searchPackages: {
      guard: () => void 0,
      fn: async ({ searchText }: { searchText: string }): Promise<SearchPackagesResponse> => {
        return searchPackages({
          searchText,
        })
      },
    },
    listDeployed: {
      guard: () => void 0,
      fn: async (): Promise<{ pkgInfos: DeployedPkgInfo[] }> => {
        const pkgInfos = await listDeployed()
        return { pkgInfos }
      },
    },
    uninstall: {
      guard: () => void 0,
      fn: async (pkgIds: PkgIdentifier[]): Promise<void> => {
        await uninstall(pkgIds)
      },
    },
    install: {
      guard: () => void 0,
      fn: async (installPkgReqs: InstallPkgReq[]): Promise<void> => {
        await install(installPkgReqs)
      },
    },
    getDefaultRegistry: {
      guard: () => void 0,
      fn: async () => {
        return npmRegistry
      },
    },
  },
})
