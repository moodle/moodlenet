import { Ext } from './ext'
import { PkgInfo } from './reg'

export type PkgDiskInfo = PkgInfo & {
  rootDir: string
  rootDirPosix: string
  mainModPath: string
}

export type PkgExport = {
  exts: Ext[]
}
