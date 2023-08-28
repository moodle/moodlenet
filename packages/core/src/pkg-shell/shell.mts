import { mkdir } from 'fs/promises'
import { join } from 'path'
import { inspect } from 'util'
import {
  assertCallInitiator,
  getCallInitiator,
  getSetCoreAsyncContext,
  mainAsyncContext,
  now,
  pkgAsyncContext,
  setNow,
} from '../async-context/lib.mjs'
import { pkgEmitter } from '../events/main-event-emitter.mjs'
import { getConfig, pkgDepGraph } from '../ignite.mjs'
import { getChildLogger, type LogLevel } from '../logger/init-logger.mjs'
import { coreConfigs } from '../main/env.mjs'
import {
  getExposedByPkgIdentifier,
  getExposedByPkgName,
  getExposes,
  pkgExpose,
} from '../pkg-expose/lib.mjs'
import { ensureRegisterPkg, listEntries, pkgEntryByPkgIdValue } from '../pkg-registry/lib.mjs'
import type { PkgModuleRef } from '../types.mjs'

export { type LogLevel } from '../logger/init-logger.mjs'
// FIXME: maintain a registry for shells (for pkg singletons)
export async function getMyShell<PkgAsyncCtx = never, Events = any>(pkg_module_ref: PkgModuleRef) {
  const { pkgId: myId, pkgInfo } = await ensureRegisterPkg(pkg_module_ref)
  const config = getConfig(myId.name)
  const myAsyncCtx = pkgAsyncContext<PkgAsyncCtx>(myId.name)
  const expose = pkgExpose(pkg_module_ref)
  const myBaseFsFolder = join(coreConfigs.baseFsFolder, ...myId.name.split('/'))
  await mkdir(myBaseFsFolder, { recursive: true })
  const logger = getChildLogger(myId)
  const events = pkgEmitter<Events>(myId)

  const pkgShell = {
    events,
    log(level: LogLevel, ...msgs: any[]) {
      msgs.forEach(msg => {
        const message = msg instanceof Error ? msg : inspect(msg, true, 5, true)
        logger.log(level, message)
      })
    },
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
    pkgDepGraph,
    now,
    setNow,
  }

  return pkgShell

  function initiateCall<R>(exec: () => R, forcewipeout = false): R {
    const baseCtx = forcewipeout ? {} : mainAsyncContext.getStore() ?? {}
    return mainAsyncContext.run({ ...baseCtx }, () => {
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
