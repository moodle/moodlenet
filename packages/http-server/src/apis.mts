import { defApi } from '@moodlenet/core'
import { mountApp } from './init.mjs'
import { MountAppArgs, MountAppItem } from './types.mjs'

export default {
  mount: defApi(
    ctx => async (mountAppArgs: MountAppArgs) => {
      const mountAppItem: MountAppItem = {
        mountAppArgs,
        pkgId: ctx.caller.pkgId,
        mountOnAbsPath: mountAppArgs.mountOnAbsPath,
      }
      await mountApp(mountAppItem)
    },
    (/* ...args */) => true,
  ),
}
