import type { AppearanceData } from '../types.mjs'
import { adjustColor, getColorPalette, randomColor, setOpacity } from './colorUtilities.mjs'

export const baseMoodleColor = '#F88012'
export const primaryColor = 'var(--base-moodle-color)'
export const primaryBackgroundColor = '#feefe2'
export const primaryColorHover = '#e2750f'
export const primaryColorActive = '#d46d0d'
export const headerBackgroundColor = 'white'

export type BaseStyleType = {
  '--primary-color': string
  '--primary-background-color': string
  '--primary-color-hover': string
  '--primary-color-active': string
  '--header-background': string
}

export const baseStyle = ({ baseColor }: { baseColor: string }): BaseStyleType => {
  return {
    '--primary-color': baseColor,
    '--primary-background-color': setOpacity(baseColor, 0.12),
    '--primary-color-hover': primaryColorHover,
    '--primary-color-active': primaryColorActive,
    '--header-background': headerBackgroundColor,
  }
}

export const randomStyle = (): BaseStyleType => {
  const newColor = randomColor()
  return {
    '--primary-color': `${newColor}`,
    '--primary-background-color': `${adjustColor(newColor, 95)}`,
    '--primary-color-hover': `${adjustColor(newColor, -10)}`,
    '--primary-color-active': `${adjustColor(newColor, -20)}`,
    '--header-background': `${adjustColor(newColor, 95)}`,
  }
}

export const getAppearanceStyle = (
  baseColor: string,
): Pick<AppearanceData, 'color' | 'customStyle'> => {
  return {
    color: baseColor,
    customStyle: {
      ...baseStyle({ baseColor }),
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
