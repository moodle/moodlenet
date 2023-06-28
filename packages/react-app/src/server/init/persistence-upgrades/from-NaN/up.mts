import { defaultAppearanceData } from '../../../../common/exports.mjs'
import { kvStore } from '../../kvStore.mjs'

await kvStore.set('configs', '', {
  webIconSize: [256, 256],
  webImageSize: [1000, 1000],
})

await kvStore.set('appearanceData', '', defaultAppearanceData)

export default 1
