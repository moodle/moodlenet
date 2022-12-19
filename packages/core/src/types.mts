import { PkgConnectionDef } from './pkg-shell/types.mjs'

export type PkgName = string
export type PkgVersion = string
export type PkgIdentifier<_PkgConnDef extends PkgConnectionDef = PkgConnectionDef> = {
  readonly name: PkgName
  readonly version: PkgVersion
  readonly $$_TYPE_PLACEHOLDER_$$?: _PkgConnDef | never
}
