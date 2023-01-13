import {
  assertCallInitiator,
  getCallInitiator,
  asyncContext,
  getSetCoreAsyncContext,
  pkgAsyncContext,
} from '../async-context/lib.mjs'
import { getConfig } from '../ignite.mjs'
import { pkgExpose, getExposedByPkgIdValue, getExposedByPkgName } from '../pkg-expose/lib.mjs'
import { ensureRegisterPkg } from '../pkg-registry/lib.mjs'
import { PkgModuleRef } from '../types.mjs'
import { listEntries, pkgEntryByPkgIdValue } from '../pkg-registry/lib.mjs'

// FIXME: maintain a registry for shells (for pkg singletons)
export async function shell<PkgAsyncCtx>(pkg_module_ref: PkgModuleRef) {
  const { pkgId: myId, pkgInfo } = await ensureRegisterPkg(pkg_module_ref)
  const config = getConfig(myId.name)
  const myAsyncCtx = pkgAsyncContext<PkgAsyncCtx>(myId.name)
  const expose = pkgExpose(pkg_module_ref)
  return {
    config,
    initiateCall,
    myAsyncCtx,
    assertCallInitiator,
    expose,
    getCallInitiator,
    getExposedByPkgIdValue,
    getExposedByPkgName,
    listEntries,
    pkgEntryByPkgIdValue,
    myId,
    pkgInfo,
    call,
    callers,
  }

  function initiateCall<R>(exec: () => R): R {
    return asyncContext.run({}, () => {
      getSetCoreAsyncContext.set(_ => ({ ..._, initiator: myId }))
      return exec()
    })
  }

  function call<Fn extends (...args: any[]) => any>(fn: Fn): Fn {
    return _call as Fn
    function _call(...args: unknown[]) {
      return initiateCall(() => fn(...args))
    }
  }

  function callers<FnMap extends { [name: string]: (...args: any[]) => any }>(fnmap: FnMap): FnMap {
    return Object.entries(fnmap).reduce(
      (_, [p_name, fn]) => ({ ..._, [p_name]: call(fn) }),
      {} as FnMap,
    )
  }
}
