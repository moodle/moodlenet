import { PkgConnectionDef } from './pkg-shell/types.mjs'

export type PkgName = string
export type PkgVersion = string
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type PkgIdentifier<PkgConnDef extends PkgConnectionDef = PkgConnectionDef> = {
  readonly name: PkgName
  readonly version: PkgVersion
  readonly _$_?: PkgConnDef | never
}
