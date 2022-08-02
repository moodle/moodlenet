import { isVerBWC, splitExtId } from '../core-lib/pointer'
import type { ExtId, ExtName, PkgInstallationId, RegItem } from '../types'

export type ExtLocalDeploymentRegistry = ReturnType<typeof createLocalDeploymentRegistry>

export const createLocalDeploymentRegistry = () => {
  const reg: {
    [Name in ExtName]: RegItem<any>
  } = {}

  return {
    get,
    getByPkgInstallationId,
    reg,
    unregister,
    assertDeployed,
    register,
    getByExtId,
  }

  function get(extName: ExtName) {
    return reg[extName]
  }

  function getByExtId(extId: ExtId) {
    const { extName, version } = splitExtId(extId)
    console.log({ extName, version })
    const regDeployment = get(extName)
    if (!regDeployment) {
      return undefined
    }
    const { version: deployedVersion } = splitExtId(regDeployment.deploymentShell.extId)
    const isCompat = isVerBWC(deployedVersion, version)
    return isCompat ? regDeployment : undefined
  }

  function getByPkgInstallationId(pkgInstallationId: PkgInstallationId) {
    const regDeployment = Object.values(reg).find(({ pkgInfo: { id } }) => pkgInstallationId === id)
    return regDeployment
  }

  function register({ regDeployment }: { regDeployment: RegItem<any> }) {
    const extName = regDeployment.ext.name
    const currDeployment = get(extName)
    if (currDeployment) {
      throw new Error(
        `can't  deploy ${regDeployment.deploymentShell.extId} as ${currDeployment.deploymentShell.extId} is already deployed since ${currDeployment.at}`,
      )
    }

    reg[extName] = regDeployment
  }

  function unregister(extName: ExtName) {
    const currDeployment = get(extName)
    delete reg[extName]
    return currDeployment
  }

  function assertDeployed(extId: ExtId) {
    const currDeployment = getByExtId(extId)
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
