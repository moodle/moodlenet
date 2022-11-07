import { PkgConnectionDef } from './shell/types/pkg.mjs'

export type PkgName = string
export type PkgVersion = string
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type PkgIdentifier<_PkgConnDef extends PkgConnectionDef = PkgConnectionDef> = {
  readonly name: PkgName
  readonly version: PkgVersion
}
