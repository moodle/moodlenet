import { isVerBWC, splitExtId } from '../k/pointer'
import type { ExtId, ExtName, PkgInfo } from '../types'

export type ExtBaseRegistry = ReturnType<typeof createBaseExtRegistry>
export type BaseReg = { extId: ExtId; pkgInfo: PkgInfo }
export const createBaseExtRegistry = <RegType extends BaseReg>() => {
  const reg: {
    [Name in ExtName]: RegType
  } = {}

  return {
    getByName,
    get,
    reg,
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
}
