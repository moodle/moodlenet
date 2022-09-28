import { defApi } from '@moodlenet/core'
import { getAppearance, setAppearance, setupPlugin } from './lib.mjs'
import { WebappPluginDef } from './types.mjs'
import { AppearanceData } from './types/data.mjs'

export default {
  getAppearance: defApi(
    _ctx => async () => {
      return getAppearance()
    },
    () => true,
  ),
  setAppearance: defApi(
    _ctx =>
      async ({ appearanceData }: { appearanceData: AppearanceData }) => {
        return setAppearance({ appearanceData })
      },
    () => true,
  ),
  plugin: defApi(
    ctx => async (pluginDef: WebappPluginDef) => {
      return await setupPlugin({ pluginDef, pkgInfo: ctx.caller.pkgInfo })
    },
    () => true,
  ),
}
