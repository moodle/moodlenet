import { adjustColor, randomColor, setOpacity } from '../../helpers/utilities'

export const baseMoodleColor = '#F88012'
export const primaryColor = 'var(--base-moodle-color)'
export const primaryBackgroundColor = '#feefe2'
export const primaryColorHover = '#e2750f'
export const primaryColorActive = '#d46d0d'
export const headerBackgroundColor = 'white'

export type BaseStyleType = {
  '--primary-color': string | undefined
  '--primary-background-color': string | undefined
  '--primary-color-hover': string | undefined
  '--primary-color-active': string | undefined
  '--header-background': string | undefined
}

export const baseStyle = (): BaseStyleType => {
  return {
    '--primary-color': baseMoodleColor,
    '--primary-background-color': setOpacity(baseMoodleColor, 0.25),
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
