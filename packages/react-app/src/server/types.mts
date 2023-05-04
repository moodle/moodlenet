import type { AppearanceData } from '../common/types.mjs'

export type KeyValueData = {
  appearanceData: AppearanceData
  configs: {
    webImageSize: [number, number]
    webIconSize: [number, number]
  }
}
