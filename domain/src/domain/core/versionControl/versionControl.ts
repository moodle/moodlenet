import { isRight, left, right } from 'fp-ts/Either'
import { logger } from '../../../types'
import { getLatestModelUpgradeData, upgradeModel } from './modelUpgrade'

const TARGET_V = 'v0_1'

export async function setup({ model, log }: { model: moo.def.model.handle; log: logger }) {
  const preflightResult = await preflight({ model, log })
  if (isRight(preflightResult)) {
    log.info(`current model version: [${TARGET_V}]`)
    return
  }
  log.info(`${preflightResult.left}: upgrading to ${TARGET_V}`)
  return upgrade({ model, log })
}

export async function preflight({ model }: { model: moo.def.model.handle; log: logger }) {
  const latestModelUpgradeData = await getLatestModelUpgradeData({ model })
  if (latestModelUpgradeData?.current !== TARGET_V) {
    return left(`current model version: [${latestModelUpgradeData?.current ?? 'null'}]`)
  }
  return right(`current model version: [${TARGET_V}]`)
}

export async function upgrade({ model, log }: { model: moo.def.model.handle; log: logger }) {
  return upgradeModel({ model, log })
}
