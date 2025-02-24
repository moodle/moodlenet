import { logger } from '../../../../types'
import * as modelUpgrades from './from'

export const TARGET_V = 'v0_1'

export async function upgradeModel({ log, handle }: { handle: moo.model.handle; log: logger }): Promise<string> {
  const latestModelUpgradeData = await handle.over(handle.model.configs.latestModuleUpgrade.get).call.query()

  const from_v = (latestModelUpgradeData?.current ?? 'init') as keyof typeof modelUpgrades | typeof TARGET_V

  if (from_v === TARGET_V) {
    log.info(`current model version: [${TARGET_V}]`)
    return TARGET_V
  }

  const upgradeMod = modelUpgrades[from_v]
  if (!upgradeMod) {
    const errorMessage = `upgrade from [${from_v}] not found`
    log.emergency(errorMessage)
    throw new Error(errorMessage)
  }

  const modelUpgradeData = await upgradeMod.upgrade({ handle })

  await handle.over(handle.model.configs.latestModuleUpgrade.save).call.sync(modelUpgradeData)

  log.info(`upgraded model from [${from_v}] to [${upgradeMod.VERSION}]`)
  return upgradeModel({ handle, log })
}
