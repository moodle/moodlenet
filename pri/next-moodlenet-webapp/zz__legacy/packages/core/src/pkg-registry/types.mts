import type { PackageInfo } from '../pkg-mng/types.mjs'
import type { PkgIdentifier } from '../types.mjs'

export type PkgEntry = {
  pkgInfo: PackageInfo
  pkgId: PkgIdentifier
}
