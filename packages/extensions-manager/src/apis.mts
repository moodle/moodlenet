import { uninstall, install, defApi, InstallPkgReq, PkgIdentifier } from '@moodlenet/core'
import { listDeployed, searchPackages } from './lib.mjs'
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
      async ({ pkgId }: { pkgId: PkgIdentifier<any> }): Promise<void> => {
        await uninstall({ pkgId })
      },
    () => true,
  ),
  install: defApi(
    _ctx =>
      async ({ installPkgReq }: { installPkgReq: InstallPkgReq }): Promise<void> => {
        await install([installPkgReq])
      },
    () => true,
  ),
}
