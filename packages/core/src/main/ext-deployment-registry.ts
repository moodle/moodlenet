import { isVerBWC, splitExtId } from '../core-lib/pointer'
import type { ExtDef, ExtId, ExtName, RegDeployment } from '../types'

export type ExtLocalDeploymentRegistry = ReturnType<typeof createLocalDeploymentRegistry>

export const createLocalDeploymentRegistry = () => {
  const reg: {
    [Name in ExtName]: RegDeployment
  } = {}

  return {
    get,
    getByName,
    reg,
    unregister,
    assertDeployed,
    register,
  }

  function get(extId: ExtId) {
    const { extName, version } = splitExtId(extId)
    const regDeployment = getByName(extName)
    if (!regDeployment) {
      return undefined
    }
    const { version: deployedVersion } = splitExtId(regDeployment.extId)
    const isCompat = isVerBWC(deployedVersion, version)
    return isCompat ? regDeployment : undefined
  }

  function getByName(extName: ExtName) {
    const regDeployment = reg[extName]
    return regDeployment
  }
  function register<Def extends ExtDef>({ depl }: { depl: RegDeployment<Def> }) {
    const { extName } = splitExtId(depl.extId)
    const currDeployment = getByName(extName)
    if (currDeployment) {
      throw new Error(
        `can't deploy ${depl.extId} as ${currDeployment.extId} is already deployed since ${currDeployment.at}`,
      )
    }

    reg[extName] = depl as any
  }

  function unregister(extName: ExtName) {
    const currDeployment = getByName(extName)
    // currDeployable?.$msg$.complete()
    // currDeployable?.tearDown.unsubscribe()
    delete reg[extName]
    return currDeployment
  }

  function assertDeployed(extId: ExtId) {
    const currDeployment = get(extId)
    if (!currDeployment) {
      throw new Error(`assertDeployed: extension matching [${extId}] not deployed`)
    }
    return currDeployment
  }

  //
  //
  // function disable(extName: ExtName) {
  //   const currDeployable = undeploy(extName)
  //   currDeployable?.$msg$.complete()
  //   delete reg[extName]
  //   return currDeployable
  // }

  // function assertEnabled(extId: ExtId) {
  //   const currDeployable = get(extId)
  //   if (!currDeployable) {
  //     throw new Error(`assertEnabled: no compat extension matching [${extId}]`)
  //   }
  //   return currDeployable
  // }

  // function enable<Def extends ExtDef>({
  //   ext,
  //   pkgInfo,
  //   shell,
  //   $msg$,
  // }: {
  //   pkgInfo: PkgInfo
  //   ext: Ext<Def>
  //   shell: Shell<Def>
  //   $msg$: Subject<IMessage<any>>
  // }) {
  //   const { extName } = splitExtId(extId)
  //   const currDeployable = reg[extName]
  //   if (currDeployable) {
  //     throw new Error(`can't register ${extId} as it's already present in registry (${currDeployable.extId})`)
  //   }
  //   const deployable = ext.enable(shell)
  //   const regDeployable: RegDeployment<Def> = { ...deployable, ext, pkgInfo, shell, $msg$, at: new Date() }
  //   return (reg[extName] = regDeployable as any)
  // }
}
