import { PkgIdentifier } from '../types.mjs'

export type CallInitiator = { pkgId: PkgIdentifier }
export type ApiCtx = Record<string, any>
export type CoreAsyncCtx = { initiator: PkgIdentifier }
