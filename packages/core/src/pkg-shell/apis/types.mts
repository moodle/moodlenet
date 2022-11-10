import { PkgIdentifier } from '../../types.mjs'
import type { TypeofPath, TypePaths } from '../types-crawl-path.js'
import { PkgModuleRef } from '../types.mjs'

export type ArgsValidity =
  | boolean
  | {
      valid: true
    }
  | { valid: false; msg?: string }
export type ArgsValidation = (...args: unknown[]) => ArgsValidity | Promise<ArgsValidity>

export type FlatApiDefs = Record<string, ApiDef>

export type ApiDef<_ApiFn extends ApiFn = ApiFn> = {
  api: CtxApiFn<_ApiFn>
  argsValidation: ArgsValidation
}

export type PrimaryCallCtx = boolean //Record<string, never>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FloorApiCtx = { primary?: PrimaryCallCtx } & Record<string, any>

export type ApiCtx = {
  // TODO: remove `moduleRef: PkgModuleRef`, make its access a scoped Core Api
  caller: { pkgId: PkgIdentifier; moduleRef: PkgModuleRef }
} & FloorApiCtx
export type CtxApiFn<_ApiFn extends ApiFn> = (ctx: ApiCtx) => _ApiFn

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiFn = (...args: any[]) => Promise<any>

export type ApiDefs = {
  [k: string]: ApiDef | ApiDefs
}

export type CallApiOpts = { ctx?: FloorApiCtx }

export type Apis<Defs extends ApiDefs> = {
  [k in keyof Defs]: Defs[k] extends ApiDefs
    ? Apis<Defs[k]>
    : Defs[k] extends ApiDef<infer _ApiFn>
    ? _ApiFn
    : // : Defs[k] extends ApiDef
      // ? ReturnType<Defs[k]['api']>
      never
}

export type ApiDefPaths<Defs extends ApiDefs> = TypePaths<Defs, ApiDef, ApiDef>

export type ApiFnType<Defs extends ApiDefs, Path extends ApiDefPaths<Defs>> = TypeofPath<
  Defs,
  Path
> extends infer Def
  ? Def extends ApiDef<infer _ApiFn>
    ? _ApiFn
    : // ? Def extends ApiDef
      // ? ReturnType<Def['api']>
      never
  : never
