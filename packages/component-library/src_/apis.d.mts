import { WebappPluginDef } from './types.mjs'
import { AppearanceData } from './types/data.mjs'
declare const _default: {
  getAppearance: import('@moodlenet/core').ApiDef<
    () => Promise<{
      data: any
    }>
  >
  setAppearance: import('@moodlenet/core').ApiDef<
    ({ appearanceData }: { appearanceData: AppearanceData }) => Promise<{
      valid: boolean
    }>
  >
  plugin: import('@moodlenet/core').ApiDef<(pluginDef: WebappPluginDef) => Promise<void>>
}
export default _default
//# sourceMappingURL=apis.d.mts.map
