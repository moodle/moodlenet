import { mkdir } from 'fs/promises'
import { join } from 'path'
import {
  assertCallInitiator,
  asyncContext,
  getCallInitiator,
  getSetCoreAsyncContext,
  pkgAsyncContext,
} from '../async-context/lib.mjs'
import { getConfig } from '../ignite.mjs'
import { coreConfigs } from '../main/env.mjs'
import {
  getExposedByPkgIdentifier,
  getExposedByPkgName,
  getExposes,
  pkgExpose,
} from '../pkg-expose/lib.mjs'
import { ensureRegisterPkg, listEntries, pkgEntryByPkgIdValue } from '../pkg-registry/lib.mjs'
import { PkgModuleRef } from '../types.mjs'

// FIXME: maintain a registry for shells (for pkg singletons)
export async function getMyShell<PkgAsyncCtx = never>(pkg_module_ref: PkgModuleRef) {
  const { pkgId: myId, pkgInfo } = await ensureRegisterPkg(pkg_module_ref)
  const config = getConfig(myId.name)
  const myAsyncCtx = pkgAsyncContext<PkgAsyncCtx>(myId.name)
  const expose = pkgExpose(pkg_module_ref)
  const myBaseFsFolder = join(coreConfigs.baseFsFolder, ...myId.name.split('/'))
  await mkdir(myBaseFsFolder, { recursive: true })
  return {
    getExposes: () => getExposes(),
    // the previous props needs to be explicitely defined, otherways tsc complains `shell(import.meta)` all aroud with:
    // ** The inferred type of 'default' cannot be named without a reference to '../node_modules/@moodlenet/core/dist/pkg-expose/lib.mjs'. This is likely not portable. A type annotation is necessary. **
    // O_O
    baseFsFolder: myBaseFsFolder,
    config,
    initiateCall,
    myAsyncCtx,
    assertCallInitiator,
    expose,
    getCallInitiator,
    getExposedByPkgIdentifier,
    getExposedByPkgName,
    listEntries,
    pkgEntryByPkgIdValue,
    myId,
    pkgInfo,
    call,
    callers,
  }

  function initiateCall<R>(exec: () => R, forcewipeout = false): R {
    const baseCtx = forcewipeout ? {} : asyncContext.getStore() ?? {}
    return asyncContext.run(baseCtx, () => {
      getSetCoreAsyncContext.set(currentCoreCtx => {
        return { ...currentCoreCtx, initiator: { pkgId: myId } }
      })
      return exec()
    })
  }

  function call<Fn extends (...args: any[]) => any>(fn: Fn, forcewipeout = false): Fn {
    return _call as Fn
    function _call(...args: unknown[]) {
      return initiateCall(() => fn(...args), forcewipeout)
    }
  }

  function callers<FnMap extends { [name: string]: (...args: any[]) => any }>(fnmap: FnMap): FnMap {
    return Object.entries(fnmap).reduce(
      (_, [p_name, fn]) => ({ ..._, [p_name]: call(fn) }),
      {} as FnMap,
    )
  }
}
