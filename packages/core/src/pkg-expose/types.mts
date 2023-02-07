import { Readable } from 'stream'
import { PkgIdentifier } from '../types.mjs'
import { RpcDefs } from './types-rpc.mjs'
export * from './types-rpc.mjs'

export type PkgExposeDef = {
  rpc: RpcDefs
}

export type PkgExpose<_PkgExposeDef extends PkgExposeDef = PkgExposeDef> = _PkgExposeDef & {
  pkgId: PkgIdentifier
}

export type RpcFile = { type: string; name: string; size: number }
export type RpcFileHandler = {
  getReadable(): Promise<Readable>
}
