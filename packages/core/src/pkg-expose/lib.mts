import assert from 'assert'
import { ensureRegisterPkg } from '../pkg-registry/lib.mjs'
import { PkgIdentifier, PkgModuleRef } from '../types.mjs'
import { ExposedRegItem, PkgExpose, PkgExposeDef } from './types.mjs'

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
