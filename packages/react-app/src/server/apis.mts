/* eslint-disable @typescript-eslint/no-unused-vars */
import { defApi } from '@moodlenet/core'
import { getAppearance, setAppearance, setupPlugin } from './lib.mjs'
import { WebappPluginDef, AppearanceData } from '../common/types.mjs'
import { PkgContextT } from '../webapp/types/plugins.mjs'

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
      async <MyPkgContext extends PkgContextT<any, any>>({
        def,
      }: {
        def: MyPkgContext extends PkgContextT<any, infer Deps> ? WebappPluginDef<Deps> : never
      }) => {
        return await setupPlugin({ pluginDef: def, pkgId: ctx.caller.pkgId })
      },
    () => true,
  ),
}
