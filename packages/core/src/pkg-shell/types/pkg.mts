import { PackageInfo, PkgIdentifier } from '../../types.mjs'
import type { TypeofPath, TypePaths } from './crawl-path.js'
export type ArgsValidity =
  | boolean
  | {
      valid: true
    }
  | { valid: false; msg?: string }
export type ArgsValidation = (...args: unknown[]) => ArgsValidity | Promise<ArgsValidity>

export type FlatApiDefs = Record<string, ApiDef<any>>

export type PkgEntry = {
  pkgInfo: PackageInfo
  apiDefs: ApiDefs
  flatApiDefs: FlatApiDefs
}

//TODO: will be removed, will become the PkgIdentifier(with sym) .. always available with myPkgId(import.meta)
export type PkgConnection<_ApiDefs extends ApiDefs> = {
  pkgSym: symbol
  pkgInfo: PackageInfo
  pkgId: PkgIdentifier
}

export type ApiDef<_ApiFn extends ApiFn> = {
  api: CtxApiFn<_ApiFn>
  argsValidation: ArgsValidation
}

export type PrimaryCallCtx = {}
export type FloorApiCtx = { primary?: PrimaryCallCtx } & Record<string, any>
export type ApiCtx = { caller: { pkgInfo: PackageInfo; moduleRef: PkgModuleRef } } & FloorApiCtx
export type CtxApiFn<_ApiFn extends ApiFn> = (ctx: ApiCtx) => _ApiFn
export type ApiFn = (...args: any[]) => Promise<any>
export type ApiDefs = {
  [k: string]: ApiDef<any> | ApiDefs
}

export type CallApiOpts = { ctx?: FloorApiCtx }
export type Apis<Defs extends ApiDefs> = {
  [k in keyof Defs]: Defs[k] extends ApiDefs
    ? Apis<Defs[k]>
    : Defs[k] extends ApiDef<infer _ApiFn>
    ? _ApiFn
    : // : Defs[k] extends ApiDef<any>
      // ? ReturnType<Defs[k]['api']>
      never
}
export type PkgModuleRef = NodeModule | ImportMeta
// export type ShellApi<S extends Shell, Path extends string>=1
// export type ApiRef<Defs extends ApiDefs> = { defs: Defs; shell: Shell }

export type ApiDefPaths<Defs extends ApiDefs> = TypePaths<Defs, ApiDef<any>, ApiDef<any>>
export type ApiFnType<Defs extends ApiDefs, Path extends ApiDefPaths<Defs>> = TypeofPath<Defs, Path> extends infer Def
  ? Def extends ApiDef<infer _ApiFn>
    ? _ApiFn
    : // ? Def extends ApiDef
      // ? ReturnType<Def['api']>
      never
  : never
