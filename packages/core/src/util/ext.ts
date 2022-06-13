import { Ext, ExtInfo, PkgInfo } from '../types'

export function ext2ExtInfo({ ext, pkgInfo }: { ext: Ext; pkgInfo: PkgInfo }): ExtInfo {
  return {
    ext: {
      id: ext.id,
      displayName: ext.displayName,
      description: ext.description,
      requires: ext.requires,
    },
    pkgInfo: {
      name: pkgInfo.name,
      version: pkgInfo.version,
    },
  }
}
