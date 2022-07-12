import { InstalledPackageInfo } from '../pkg-mng/types'
import { Ext, ExtInfo } from '../types'

export function ext2ExtInfo({ ext, pkgInfo }: { ext: Ext; pkgInfo: InstalledPackageInfo }): ExtInfo {
  return {
    ext: {
      id: ext.id,
      displayName: ext.displayName,
      description: ext.description,
      requires: ext.requires,
    },
    installationFolder: pkgInfo.installationFolder,
  }
}
