import { defApi } from './pkg-shell/apis/shell.mjs'
import { checkUpdates, install, uninstall, updateAll } from './pkg-mng/lib/npm.mjs'
import { listEntries, pkgEntryByPkgId } from './pkg-registry/lib.mjs'
import { PkgIdentifier } from './types.mjs'
import { InstallPkgReq } from './main.mjs'

export default {
  'active-pkgs': {
    'ls': defApi(
      _ctx => async () => {
        const entries = await listEntries()
        return entries
      },
      () => true,
    ),
    'get-by-pkgid': defApi(
      _ctx => async (pkgId: PkgIdentifier) => {
        const entry = await pkgEntryByPkgId(pkgId)
        return entry
      },
      () => true,
    ),
  },
  'pkg-mng': {
    install: defApi(
      _ctx => async (pkgs: InstallPkgReq[]) => {
        await install(pkgs)
        return
      },
      () => true,
    ),
    uninstall: defApi(
      _ctx => async (pkgs: PkgIdentifier[]) => {
        await uninstall(pkgs)
        return
      },
      () => true,
    ),
    checkUpdates: defApi(
      _ctx => async () => {
        const ncuRes = await checkUpdates()
        return ncuRes
      },
      () => true,
    ),
    updateAll: defApi(
      _ctx => async () => {
        const ncuRes = await updateAll()
        return ncuRes
      },
      () => true,
    ),
  },
}
