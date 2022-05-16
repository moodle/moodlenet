import type { AllPaths, ExtDef, ExtDeployment, ExtId, KernelExt, PortShell } from '../../../types'
import { splitExtId, splitPointer } from '../../pointer'

//TODO: rather use probe() ?
//TODO: remove those CONSTS
const DEPLOYED_PATH: AllPaths<KernelExt> = 'extension/deployed'
const UNDEPLOYED_PATH: AllPaths<KernelExt> = 'extension/undeployed'
const KERNEL_EXT_NAME: KernelExt['name'] = 'kernel.core'
type Watcher<Def extends ExtDef> = (_: ExtDeployment<Def> | undefined) => void
export const watchExt = <Def extends ExtDef>(shell: PortShell, extId: ExtId<Def>, watcher: Watcher<Def>) => {
  const splitWatchingExtId = splitExtId(extId)
  trigWatch()
  //TODO: rather use probe() ?
  return shell.listen(listenShell => {
    const srcSplitPointer = splitPointer(listenShell.message.source)
    const trgSplitPointer = splitPointer(listenShell.message.target)
    if (
      srcSplitPointer.extName === splitWatchingExtId.extName &&
      trgSplitPointer.extName === KERNEL_EXT_NAME &&
      (DEPLOYED_PATH === trgSplitPointer.path || UNDEPLOYED_PATH === trgSplitPointer.path)
    ) {
      setImmediate(trigWatch) //TODO: WHY SET IMMEDIATE?
    }
  })

  function trigWatch() {
    const extDepl = shell.registry.get(extId)
    if (!extDepl) {
      return
    }
    //TODO: where to check versioning? def & impl `requires()` , `xxX()`
    // const regRecSplitExtId = splitExtId(extRecord.extId)
    // if (!isVerBWC(regRecSplitExtId.version, splitWatchingExtId.version)) {
    //   return
    // }
    watcher(extDepl as any)
  }
}

type Cleanup = () => any
type MCleanup = Cleanup | undefined | void
type ExtUser<Def extends ExtDef> = (_: ExtDeployment<Def>) => MCleanup
export const useExtension = <Def extends ExtDef>(shell: PortShell, extId: ExtId<Def>, extUser: ExtUser<Def>) => {
  let cleanup: MCleanup
  const unlisten = watchExt<Def>(shell, extId, extDepl => {
    if (!(extDepl?.status === 'deployed')) {
      cleanup?.()
    } else {
      cleanup = extUser(extDepl)
    }
  })
  return () => {
    cleanup?.()
    unlisten()
  }
}
