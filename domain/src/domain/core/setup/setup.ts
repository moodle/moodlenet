import { isRight, left, right } from 'fp-ts/Either'
import { logger } from '../../../types'
import { upgradeModel } from './upgrade'

const TARGET_V = 'v0_1'

export async function setup({ handle, log }: { handle: moo.model.handle; log: logger }) {
  const preflightResult = await preflight({ handle, log })
  if (isRight(preflightResult)) {
    return
  }
  return upgrade({ handle, log })
}

export async function preflight({ handle }: { handle: moo.model.handle; log: logger }) {
  const latestModelUpgradeData = await handle.over(handle.model.configs.latestModuleUpgrade.get).call.query()
  if (latestModelUpgradeData?.current !== TARGET_V) {
    return left(`current model version: [${latestModelUpgradeData?.current}] is not equal to [${TARGET_V}]`)
  }
  return right(`current model version: [${TARGET_V}]`)
}

export async function upgrade({ handle, log }: { handle: moo.model.handle; log: logger }) {
  return upgradeModel({ handle, log })
}
