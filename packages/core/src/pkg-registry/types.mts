import { PackageInfo } from '../pkg-mng/types.mjs'
import { PkgConnectionDef } from '../pkg-shell/types.mjs'
import { FlatApiDefs } from '../pkg-shell/apis/types.mjs'
import { PkgIdentifier } from '../types.mjs'

export type PkgEntry<PkgConnDef extends PkgConnectionDef = PkgConnectionDef> = {
  pkgInfo: PackageInfo
  pkgId: PkgIdentifier<PkgConnDef>
  pkgConnectionDef: PkgConnDef
  flatApiDefs: FlatApiDefs
}
