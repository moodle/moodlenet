import { defApi, InstallPkgReq, NPM_REGISTRY, PkgIdentifier } from '@moodlenet/core'
import { uninstall, install, listDeployed, searchPackages } from './lib.mjs'
import { DeployedPkgInfo, SearchPackagesResponse } from './types/data.mjs'

export default {
  searchPackages: defApi(
    _ctx =>
      async ({ searchText }: { searchText: string }): Promise<SearchPackagesResponse> => {
        return searchPackages({
          searchText,
        })
      },
    () => true,
  ),
  listDeployed: defApi(
    _ctx => async (): Promise<{ pkgInfos: DeployedPkgInfo[] }> => {
      const pkgInfos = await listDeployed()
      return { pkgInfos }
    },
    () => true,
  ),
  uninstall: defApi(
    _ctx =>
      async (pkgIds: PkgIdentifier[]): Promise<void> => {
        await uninstall(pkgIds)
      },
    () => true,
  ),
  install: defApi(
    _ctx =>
      async (installPkgReqs: InstallPkgReq[]): Promise<void> => {
        await install(installPkgReqs)
      },
    () => true,
  ),
  getDefaultRegistry: defApi(
    _ctx => async () => {
      return NPM_REGISTRY
    },
    () => true,
  ),
}
