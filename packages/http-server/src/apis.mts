import { defApi } from '@moodlenet/core'
import { httpServer } from './init.mjs'
import { MountAppArgs, MountAppItem } from './types.mjs'

export default {
  mount: defApi(
    ctx => async (mountAppArgs: MountAppArgs) => {
      const mountAppItem: MountAppItem = {
        mountAppArgs,
        pkgId: ctx.caller.pkgId,
        mountOnAbsPath: mountAppArgs.mountOnAbsPath,
      }
      const unmount = await httpServer.mountApp(mountAppItem)
      // FIXME: on uninstall unmount()
      return unmount
    },
    (/* ...args */) => true,
  ),
}
