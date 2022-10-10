import { defApi } from '@moodlenet/core'
import { getAppearance, setAppearance, setupPlugin } from './lib.mjs'
export default {
  getAppearance: defApi(
    _ctx => async () => {
      return getAppearance()
    },
    () => true,
  ),
  setAppearance: defApi(
    _ctx =>
      async ({ appearanceData }) => {
        return setAppearance({ appearanceData })
      },
    () => true,
  ),
  plugin: defApi(
    ctx => async pluginDef => {
      return await setupPlugin({ pluginDef, pkgInfo: ctx.caller.pkgInfo })
    },
    () => true,
  ),
}
//# sourceMappingURL=apis.mjs.map
