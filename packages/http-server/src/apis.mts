import { defApi } from '@moodlenet/core'
import { httpServer } from './init.mjs'
import { MountAppArgs, MountAppItem } from './types.mjs'

export default {
  mount: defApi(
    ctx => async (mountAppArgs: MountAppArgs) => {
      const mountAppItem: MountAppItem = {
        mountAppArgs,
        pkgInfo: ctx.caller.pkgInfo,
        mountPath: mountAppArgs.mountOnAbsPath ?? ctx.caller.pkgInfo.pkgId.name,
      }
      const unmount = httpServer.mountApp(mountAppItem)
      // FIXME: on uninstall unmount()
      return unmount
    },
    (/* ...args */) => true,
  ),
}
