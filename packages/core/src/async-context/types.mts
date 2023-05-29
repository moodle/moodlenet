import type { PkgIdentifier } from '../types.mjs'

export type { assertCallInitiator, getCallInitiator } from './lib.mjs'
export type CallInitiator = { pkgId: PkgIdentifier }
export type ApiCtx = Record<string, any>
export type CoreAsyncCtx = {
  initiator?: { pkgId: PkgIdentifier }
  rpcStatus?: RpcStatusType
  deltaNow?: number
}
export type RpcStatusType = {
  rpcStatusCode: number
  payload?: any
}
