import { PkgIdentifier, PkgModuleRef } from '../types.mjs'
import assert from 'assert'
import { ensureRegisterPkg } from '../pkg-registry/lib.mjs'
import { PkgExpose, PkgExposeDef } from './types.mjs'

type ExposedRegItem = {
  pkgId: PkgIdentifier
  // exposeDef: PkgExposeDef
  expose: PkgExpose
}

const _PKG_EXPOSED_REG: ExposedRegItem[] = []

export function pkgExpose(pkg_module_ref: PkgModuleRef) {
  return async function expose<_PkgExposeDef extends PkgExposeDef>(
    exposeDef: _PkgExposeDef,
  ): Promise<PkgExpose<_PkgExposeDef>> {
    const { pkgId } = await ensureRegisterPkg(pkg_module_ref)
    assert(!getExposedByPkgIdValue(pkgId), `cannot expose twice for ${pkgId.name}@${pkgId.version}`)
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

export function getExposedByPkgIdValue(pkgId: PkgIdentifier) {
  const exposed = getExposedByPkgName(pkgId.name)
  //FIXME: check pkg version compatibility
  return exposed
}

export function getExposedByPkgName(pkgName: string) {
  return _PKG_EXPOSED_REG.find(({ pkgId: { name } }) => name === pkgName)
}
