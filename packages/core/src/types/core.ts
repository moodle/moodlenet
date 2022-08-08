import { SubTopo } from '../core-lib'
import { InstallPkgReq, PackageInfo, PkgInstallationId } from '../pkg-mng/types'
import type { ExtDef, ExtId } from './ext'
import type { Port } from './topo'

export type CoreExt = ExtDef<
  '@moodlenet/core',
  '0.1.0',
  {
    ext: {
      deployed: Port<'out', { extId: ExtId }>
      undeployed: Port<'out', { extId: ExtId }>
      listDeployed: SubTopo<void, { pkgInfos: PackageInfo[] }>
      // deploy: SubTopo<
      //   {
      //     extId: ExtId
      //     installationFolder: string
      //   },
      //   void
      // >
    }
    pkg: {
      installed: Port<'out', { extId: ExtId }>
      uninstalled: Port<'out', { extId: ExtId }>
      uninstall: SubTopo<{ pkgInstallationId: PkgInstallationId }, void>
      install: SubTopo<{ installPkgReq: InstallPkgReq }, { pkgInfo: PackageInfo }>
      getPkgStorageInfos: SubTopo<void, { pkgInfos: PackageInfo[] }>
      getInstalledPackages: SubTopo<void, { pkgInfos: PackageInfo[] }>
    }
  },
  void,
  void
>

// export type ExtInfo = {
//   ext: Omit<Ext, 'enable'>
//   packageInfo: PackageInfo
// }
