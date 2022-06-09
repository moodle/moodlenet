import { isVerBWC, splitExtId } from '../core-lib/pointer'
import type { ExtId, ExtName, RegDeployment } from '../types'

export type ExtBaseRegistry = ReturnType<typeof createBaseExtRegistry>
export const createBaseExtRegistry = () => {
  const reg: {
    [Name in ExtName]: RegDeployment
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
