import assert from 'assert'
import { ensureRegisterPkg } from '../pkg-registry/lib.mjs'
import { PkgIdentifier, PkgModuleRef } from '../types.mjs'
import { ExposedRegItem, PkgExpose, PkgExposeDef, RpcFile, RpcFileHandler } from './types.mjs'

const _PKG_EXPOSED_REG: ExposedRegItem[] = []

export function pkgExpose(pkg_module_ref: PkgModuleRef) {
  return async function expose<_PkgExposeDef extends PkgExposeDef>(
    exposeDef: _PkgExposeDef,
  ): Promise<PkgExpose<_PkgExposeDef>> {
    const { pkgId } = await ensureRegisterPkg(pkg_module_ref)
    assert(
      !getExposedByPkgIdentifier(pkgId),
      `cannot expose twice for ${pkgId.name}@${pkgId.version}`,
    )
    // FIXME: ensure in "init" phase
    const pkgExpose: PkgExpose<_PkgExposeDef> = {
      ...exposeDef,
      pkgId,
    }

    const pkgExposeRegItem: ExposedRegItem = { /* exposeDef,  */ pkgId, expose: pkgExpose }
    _PKG_EXPOSED_REG.push(pkgExposeRegItem)

    return pkgExpose
  }
}

export function getExposedByPkgIdentifier(pkgId: PkgIdentifier) {
  const exposed = getExposedByPkgName(pkgId.name)
  //FIXME: check pkg version compatibility
  return exposed
}

export function getExposes() {
  return _PKG_EXPOSED_REG.slice()
}

export function getExposedByPkgName(pkgName: string) {
  return _PKG_EXPOSED_REG.find(({ pkgId: { name } }) => name === pkgName)
}

const RPC_FILE_HANDLER_SYM = Symbol('RPC_FILE_HANDLER_SYMBOL')
export function primarySetRpcFileHandler(rpcFile: RpcFile, handler: RpcFileHandler): RpcFile {
  assert(!!rpcFile, 'cannot attach RpcFileHandler to unvalued RpcFile')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore brute force symbol prop mixin
  rpcFile[RPC_FILE_HANDLER_SYM] = handler
  return rpcFile
}
export function getRpcFileHandler(rpcFile: RpcFile): RpcFileHandler {
  assert(!!rpcFile, 'cannot get RpcFileHandler from unvalued RpcFile')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore brute force symbol prop mixin
  const handler = rpcFile[RPC_FILE_HANDLER_SYM]
  assert(!!handler, 'this RpcFile has no handler attached')
  return handler
}
