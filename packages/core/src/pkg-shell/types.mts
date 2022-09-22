import { PackageInfo } from '../types.mjs'
import type { Shell } from './connect.mjs'
import type { TypeofPath, TypePaths } from './crawl-path.js'
export type ArgsValidity =
  | boolean
  | {
      valid: true
    }
  | { valid: false; msg?: string }
export type ArgsValidation = (...args: unknown[]) => ArgsValidity | Promise<ArgsValidity>

export type PkgConnection = { shell: Shell<any>; apiDefs: ApiDefs }

export type ApiDef<_ApiFn extends ApiFn> = {
  api: CtxApiFn<_ApiFn>
  argsValidation: ArgsValidation
}

export type PrimaryCallCtx = {}
export type FloorApiCtx = { primary?: PrimaryCallCtx } & Record<string, any>
export type ApiCtx = { caller: PackageInfo } & FloorApiCtx
export type CtxApiFn<_ApiFn extends ApiFn> = (ctx: ApiCtx) => _ApiFn
export type ApiFn = (...args: any[]) => Promise<any>
export type ApiDefs = {
  [k: string]: ApiDef<any> | ApiDefs
}

export type Apis<Defs extends ApiDefs> = {
  [k in keyof Defs]: Defs[k] extends ApiDefs
    ? Apis<Defs[k]>
    : Defs[k] extends ApiDef<infer _ApiFn>
    ? _ApiFn
    : // : Defs[k] extends ApiDef<any>
      // ? ReturnType<Defs[k]['api']>
      never
}

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

// const apiDefs = {
//   a: {
//     b: {
//       api:(ctx)=>async <T,>(a: T, b: number) =>{
//         return { a, b }
//       },
//       args(...args:unknown []) {
//         return !!args
//       },
//     },
//   },
// }
// declare const apis: Apis<typeof apiDefs>
// declare const api: ApiType<typeof apiDefs, 'a/b'>

// apis.a.b<{rrrr:number}>({rrrr:1},1).then(_=>{_.a.rrrr})
// api<string>('1',1).then(_=>{_.a})
