import { modelUpgradeData } from '../../../../../model/configs.model'
import { insertInitialData } from './0.insertInitialData'
import { insertModConfigs } from './1.insertModConfigs'
// import { removePropOnInsert } from '../lib/id'

export const VERSION = 'v0_1'
export async function upgrade({ handle }: { handle: moo.model.handle }) {
  await insertInitialData({ handle })
  await insertModConfigs({ handle })

  // bump_version
  const upgradeData: modelUpgradeData = {
    previous: '_',
    current: VERSION,
    date: new Date().toISOString(),
    meta: 'initialization',
  }

  return upgradeData
}
