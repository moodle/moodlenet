import { logger } from '../../../../../../types'
import { modelUpgradeData } from '../../../../../model/statics.model'
import { insertInitialData } from './0.insertInitialData'
import { insertModStatics } from './1.insertModStatics'
// import { removePropOnInsert } from '../lib/id'

export const VERSION = 'v0_1'
export async function upgrade({ model, log }: { model: moo.def.model.handle; log: logger }) {
  await insertInitialData({ model, log })
  await insertModStatics({ model, log })

  // bump_version
  const upgradeData: modelUpgradeData = {
    previous: '_',
    current: VERSION,
    date: new Date().toISOString(),
    meta: 'initialization',
  }

  return upgradeData
}
