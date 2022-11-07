import { PackageInfo } from '../pkg-mng/types.mjs'
import { FlatApiDefs, PkgConnectionDef } from '../shell/types/pkg.mjs'
import { PkgIdentifier } from '../types.mjs'

export type PkgEntry<PkgConnDef extends PkgConnectionDef = PkgConnectionDef> = {
  pkgInfo: PackageInfo
  pkgId: PkgIdentifier<PkgConnDef>
  pkgConnectionDef: PkgConnDef
  flatApiDefs: FlatApiDefs
}
