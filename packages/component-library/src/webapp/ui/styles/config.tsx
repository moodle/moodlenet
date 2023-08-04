import { setOpacity } from './utilities.js'

export const baseMoodleColor = '#f88012'

export const baseLightGreenColor = '#00bd7e'
export const baseLightRedColor = '#ff3131'
export const baseElectricBlueColor = '#1a6aff'
export const baseBlackColor = '#212121'
export const baseGreyColor = '#687082'
export const baseWhiteColor = '#fff'

export const primaryColor = baseMoodleColor
export const primaryBackgroundColor = '#feefe2'
export const primaryColorHover = '#e2750f'
export const primaryColorActive = '#d46d0d'

export type BaseStyleType = {
  '--base-moodle-color': string

  '--base-white-color': string
  '--base-light-green-color': string
  '--base-light-red-color': string
  '--base-electric-blue-color': string
  '--base-black-color': string
  '--base-grey-color': string

  '--primary-color': string
  '--primary-background-color': string
  '--primary-color-hover': string
  '--primary-color-active': string
  '--header-background': string
  '--error-color': string
  '--warning-color': string
  '--info-color': string
  '--success-color': string
}

export const baseStyle = (baseColor = baseMoodleColor): BaseStyleType => {
  return {
    '--base-moodle-color': baseMoodleColor,

    '--base-white-color': baseWhiteColor,
    '--base-light-green-color': baseLightGreenColor,
    '--base-light-red-color': baseLightRedColor,
    '--base-electric-blue-color': baseElectricBlueColor,
    '--base-black-color': baseBlackColor,
    '--base-grey-color': baseGreyColor,

    '--primary-color': baseColor,
    '--primary-background-color': setOpacity(baseColor, 0.12),
    '--primary-color-hover': primaryColorHover,
    '--primary-color-active': primaryColorActive,
    '--header-background': baseWhiteColor,
    '--error-color': baseLightRedColor,
    '--warning-color': baseMoodleColor,
    '--info-color': baseElectricBlueColor,
    '--success-color': baseLightGreenColor,
  }
}

// export const randomStyle = () => {
//   const newColor = randomColor()
//   return {
//     '--primary-color': `${newColor}`,
//     '--primary-background-color': `${adjustColor(newColor, 95)}`,
//     '--primary-color-hover': `${adjustColor(newColor, -10)}`,
//     '--primary-color-active': `${adjustColor(newColor, -20)}`,
//     '--header-background': `${adjustColor(newColor, 95)}`,
//   }
// }
