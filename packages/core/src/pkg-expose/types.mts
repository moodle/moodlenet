import type { PkgIdentifier } from '../types.mjs'
import type { RpcDefItem, RpcFn } from './types-rpc.mjs'
export * from './types-rpc.mjs'

export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly'

export type PkgRpcDefs = Record<string, RpcFn>
export type PkgExposeDef<Def extends { rpc: PkgRpcDefs } = { rpc: PkgRpcDefs }> = Def

export type PkgExpose<_PkgExposeDef extends PkgExposeDef = PkgExposeDef> =
  PkgExposeImpl<_PkgExposeDef> & {
    pkgId: PkgIdentifier
  }

export type PkgExposeImpl<Def extends PkgExposeDef> = {
  rpc: {
    [name in keyof Def['rpc']]: RpcDefItem<Def['rpc'][name]>
  }
}
