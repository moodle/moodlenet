import { Ext } from './ext'
import { PkgInfo } from './reg'

export type PkgDiskInfo = PkgInfo & {
  rootDir: string
  mainModPath: string
}
export type PackageExt = {
  pkgDiskInfo: PkgDiskInfo
  exts: Ext[]
}

export type PkgRegistry = PackageExt[]
