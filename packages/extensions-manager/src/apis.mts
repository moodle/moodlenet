import { defApi, InstallPkgReq, PkgIdentifier, sys } from '@moodlenet/core'
import { listDeployed, searchPackages } from './lib.mjs'
import { DeployedPkgInfo, SearchPackagesResponse } from './types/data.mjs'

export default {
  searchPackages: defApi(
    _ctx =>
      async ({ searchText, registry }: { searchText: string; registry?: string }): Promise<SearchPackagesResponse> => {
        return searchPackages({
          searchText,
          registry,
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
      async ({ pkgId }: { pkgId: PkgIdentifier }): Promise<void> => {
        const _sys = await sys()
        await _sys.pkgMng.uninstall({ pkgId })
      },
    () => true,
  ),
  install: defApi(
    _ctx =>
      async ({ installPkgReq }: { installPkgReq: InstallPkgReq }): Promise<void> => {
        const _sys = await sys()
        await _sys.pkgMng.install(installPkgReq)
      },
    () => true,
  ),
}
