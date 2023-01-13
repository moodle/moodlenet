import { PackageInfo } from '../pkg-mng/types.mjs'
import { PkgIdentifier } from '../types.mjs'

export type PkgEntry = {
  pkgInfo: PackageInfo
  pkgId: PkgIdentifier
}
