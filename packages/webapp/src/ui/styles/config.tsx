import { adjustColor, randomColor } from '../../helpers/utilities'

export const baseMoodleColor = '#f88012'
export const primaryColor = 'var(--base-moodle-color)'
export const primaryColorHover = '#e2750f'
export const primaryColorActive = '#d46d0d'
export const headerBackgroundColor = 'white'

export const baseStyle = {
  '--base-moodle-color': baseMoodleColor,
  '--primary-color': primaryColor,
  '--primary-color-hover': primaryColorHover,
  '--primary-color-active': primaryColorActive,
  '--header-background': headerBackgroundColor,
} as React.CSSProperties

export const randomStyle = () => {
  const newColor = randomColor()
  return {
    '--primary-color': `${newColor}`,
    '--primary-color-hover': `${adjustColor(newColor, -10)}`,
    '--primary-color-active': `${adjustColor(newColor, -20)}`,
    '--header-background': `${adjustColor(newColor, 95)}`,
  } as React.CSSProperties
}
