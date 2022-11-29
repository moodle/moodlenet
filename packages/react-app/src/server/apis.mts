/* eslint-disable @typescript-eslint/no-unused-vars */
import { defApi } from '@moodlenet/core'
import { getAppearance, setAppearance, setupPlugin } from './lib.mjs'
import { WebappPluginDef, AppearanceData } from '../common/types.mjs'
import { WebPkgDepList } from '../webapp/web-lib.mjs'

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
    ctx =>
      async <Deps extends WebPkgDepList = never>(pluginDef: WebappPluginDef<Deps>) => {
        return await setupPlugin({ pluginDef, pkgId: ctx.caller.pkgId })
      },
    () => true,
  ),
}
