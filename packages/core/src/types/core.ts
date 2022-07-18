import { SubTopo } from '../core-lib'
import { InstallPkgReq, PackageInfo } from '../pkg-mng/types'
import type { Ext, ExtDef, ExtId } from './ext'
import type { Port } from './topo'

export type CoreExt = ExtDef<
  'moodlenet-core',
  '0.1.10',
  {
    ext: {
      deployed: Port<'out', { extId: ExtId }>
      undeployed: Port<'out', { extId: ExtId }>
      listDeployed: SubTopo<void, { extInfos: ExtInfo[] }>
      deploy: SubTopo<
        {
          extId: ExtId
          installationFolder: string
        },
        void
      >
    }
    pkg: {
      uninstall: SubTopo<{ installationFolder: string }, void>
      install: SubTopo<{ installPkgReq: InstallPkgReq; deploy?: boolean }, { extInfos: ExtInfo[] }>
      getPkgStorageInfos: SubTopo<void, { pkgInfos: PackageInfo[] }>
      getInstalledPackages: SubTopo<void, { pkgInfos: PackageInfo[] }>
    }
  }
>

export type ExtInfo = {
  ext: Omit<Ext, 'enable'>
  packageInfo: PackageInfo
}
