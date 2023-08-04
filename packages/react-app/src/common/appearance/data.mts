// import { getColorPalette, setOpacity } from './colorUtilities.mjs'

import { baseMoodleColor, baseStyle, getColorPalette } from '@moodlenet/component-library'
import type { AppearanceData } from '../types.mjs'

export const getAppearanceStyle = (
  baseColor: string,
): Pick<AppearanceData, 'color' | 'customStyle'> => {
  return {
    color: baseColor,
    customStyle: {
      ...baseStyle(baseColor),
      ...getColorPalette(baseColor),
    },
  }
}

export const defaultAppearanceData: AppearanceData = {
  logo: '',
  smallLogo: '',
  // scss: '',
  ...getAppearanceStyle(baseMoodleColor),
}
