import { _any } from '@moodle/lib-types'
import assert from 'assert'
import defaultsDeep from 'lodash-es/defaultsDeep'
import type { ReactElement } from 'react'
import type { PartialDeep } from 'type-fest'
import { getVimeoEmbed, getVimeoThumbnail } from '../molecules/embeds/Vimeo/Vimeo'
import { getYouTubeEmbed, getYouTubeThumbnail } from '../molecules/embeds/Youtube/Youtube'
import { ContentBackupImages } from './ContentBackupImages'
import type { CreditedImage } from './types'
export const elementFullyInViewPort = (
  el: Element,
  options?: {
    marginTop?: number
  },
): boolean => {
  const boundingClient = el.getBoundingClientRect()
  const { left, right, bottom } = boundingClient
  let { top } = boundingClient

  const height = bottom - top
  const width = right - left
  if (options?.marginTop) {
    top = top - options.marginTop
  }

  return (
    top >= window.pageYOffset &&
    left >= window.pageXOffset &&
    top + height <= window.pageYOffset + window.innerHeight &&
    left + width <= window.pageXOffset + window.innerWidth
  )
}

export const isEllipsisActive = (e: HTMLElement) =>
  e.offsetWidth < e.scrollWidth || e.offsetHeight < e.scrollHeight

export const range = (size: number, startAt = 0) => {
  return [...Array(size).keys()].map(i => i + startAt)
}

export const shuffleArray = <T,>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const [element_i, element_j] = [array[i], array[j]]
    assert(element_i && element_j, 'This should never happen')
    ;[array[i], array[j]] = [element_j, element_i]
  }
  return array
}

export const getRandomInt = (max: number): number => Math.floor(Math.random() * max)

export const randomIntFromInterval = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const fileExceedsMaxUploadSize = (size: number, max: number | null) =>
  max === null ? false : size > max

export const getYearList = (startYear: number): string[] => {
  const currentYear = new Date().getFullYear()
  const years = []
  while (startYear <= currentYear) {
    years.push((startYear++).toString())
  }
  return years.reverse()
}

export const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
}

export const getNumberFromString = (s: string) => {
  let number = 1

  s.split('').forEach(l => {
    number = number * l.charCodeAt(0)
  })

  return number
}

export const getPastelColor = (i?: number, opacity = 1) => {
  const number = i ? parseFloat('0.' + i.toString().slice(0, 5).replace('.', '')) : Math.random()
  return 'hsla(' + 360 * number + ',' + '75%,' + '50%, ' + opacity + ')'
  // return 'hsla(' + 360 * number + ',' + (25 + 60 * number) + '%,' + (45 + 1 * number) + '%, ' + opacity + ')'
}

export const getBackupImage = (id: string): CreditedImage | undefined => {
  const numId = getNumberFromString(id)
  return ContentBackupImages[numId % ContentBackupImages.length]
}
export type EmbedType = ReactElement | null
export type ThumbnailType = string | null

export const getPreviewFromUrl = (url: string): EmbedType => {
  const domain = getDomainUrl(url)
  switch (domain) {
    case 'youtube.com':
    case 'youtu.be':
      return getYouTubeEmbed(url)
    case 'vimeo.com':
      return getVimeoEmbed(url)
    default:
      return null
  }
}

export const getThumbnailFromUrl = (url: string): ThumbnailType => {
  const domain = getDomainUrl(url)
  switch (domain) {
    case 'youtube.com':
    case 'youtu.be':
      return getYouTubeThumbnail(url)
    case 'vimeo.com':
      return getVimeoThumbnail(url)
    default:
      return null
  }
}

export const getDomainUrl = (url: string): string | undefined => {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch (e) {
    return undefined
  }
}

export const overrideDeep = <T,>(base: T, overrides: PartialDeep<T> | undefined): T => {
  return defaultsDeep(overrides, base)
}

export const adjustColor = (color: string, amount: number) => {
  return (
    '#' +
    color
      .replace(/^#/, '')
      .replace(/../g, color =>
        ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2),
      )
  )
}

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export const humanFileSize = (bytes: number, si = false, dp = 1) => {
  const thresh = si ? 1000 : 1024

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }

  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  // si
  //   : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  let u = -1
  const r = 10 ** dp

  do {
    bytes /= thresh
    ++u
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)

  return bytes.toFixed(dp) + ' ' + units[u]
}

export const setOpacity = (color: string, opacity: number): string => {
  // coerce values so ti is between 0 and 1.
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255)
  return color + _opacity.toString(16).toUpperCase()
}

export const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`

type HslType = { h: number; s: number; l: number }
type RgbType = { r: number; g: number; b: number }

export const hexToRgb = (hex: string): RgbType => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function (_, r, g, b) {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: result[1] ? parseInt(result[1], 16) : 0,
        g: result[2] ? parseInt(result[2], 16) : 0,
        b: result[3] ? parseInt(result[3], 16) : 0,
      }
    : { r: 0, g: 0, b: 0 }
}

export const rgbToHex = (rgb: RgbType): string => {
  const { r, g, b } = rgb
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).toUpperCase().slice(1)
}

export const rgbToHsl = (rgbColor: RgbType): HslType => {
  let h = 0
  let s = 0
  let l = 0

  const [r, g, b] = [rgbColor.r / 255, rgbColor.g / 255, rgbColor.b / 255]

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  if (max === min) {
    h = 0
  } else if (max === r) {
    h = 60 * ((g - b) / (max - min))
  } else if (max === g) {
    h = 60 * (2 + (b - r) / (max - min))
  } else if (max === b) {
    h = 60 * (4 + (r - g) / (max - min))
  }

  if (h < 0) {
    h += 360
  }

  if (max === 0 || min === 1) {
    s = 0
  } else {
    s = ((max - min) / (1 - Math.abs(max + min - 1))) * 100
  }

  l = ((max + min) / 2) * 100
  ;[h, s, l] = [Math.round(h), Math.round(s), Math.round(l)]

  return { h, s, l } // {hue, saturation, lightness}
}

// const rgbToString = (rgb: RgbType): string => {
//   const { r, g, b } = rgb
//   return 'rgb(' + r + ' ' + g + ' ' + g + ')'
// }

const hslToRgb = (hsl: HslType): RgbType => {
  let { s, l } = hsl
  const { h } = hsl

  // IMPORTANT if s and l between 0,1 comment the next two lines:
  s /= 100
  l /= 100

  const core = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(core(n) - 3, Math.min(9 - core(n), 1)))
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  }
}

export const hslForCss = (hsl: HslType): string => {
  const { h, s, l } = hsl
  return `hsl(${h}, ${s}%, ${l}%)`
}

export const hexToHsl = (hex: string): HslType => {
  return rgbToHsl(hexToRgb(hex))
}

export const hslToHex = (hsl: HslType): string => {
  return rgbToHex(hslToRgb(hsl))
}

export const changeHue = (hsl: HslType, i: number): HslType => {
  return { h: i, s: hsl.s, l: hsl.l }
}

export const changeSaturation = (hsl: HslType, i: number): HslType => {
  return { h: hsl.h, s: i, l: hsl.l }
}

export const changeLightness = (hsl: HslType, i: number): HslType => {
  return { h: hsl.h, s: hsl.s, l: i }
}

export const darken = (hsl: HslType, i: number): HslType => {
  let { l } = hsl
  l = l * ((100 - i) / 100)
  return { ...hsl, l }
}
export const lighten = (hsl: HslType, i: number): HslType => {
  let { l } = hsl
  const newL = (l * (100 + i)) / 100
  l = newL > 100 ? 100 : newL
  return { ...hsl, l }
}
export const saturate = (hsl: HslType, i: number): HslType => {
  let { s } = hsl
  const newS = s * ((100 + i) / 100)
  s = newS > 100 ? 100 : newS
  return { ...hsl, s }
}
export const desaturate = (hsl: HslType, i: number): HslType => {
  let { s } = hsl
  s = s * ((100 - i) / 100)
  return { ...hsl, s }
}

// Sometimes the colour resulting from the purest-tone function is too dark or
// too light to work with. This function balances this and returns a colour
// ready to be worked with.
export const balanceColor = (hex: string) => {
  let colorBase: HslType | 'none' = 'none'

  // Let's get the brightenss of the resulting color to check next if it's
  // too dark or too bright.
  const hsl = hexToHsl(hex)
  const l = hsl.l
  const colorSaturated = changeSaturation(hsl, 100)

  // If the result is too bright we will darken it
  if (l > 66) {
    colorBase = changeLightness(hsl, 66)

    // If the result is too dark we will lighten it
  } else if (l < 20) {
    colorBase = changeLightness(colorSaturated, 20)
    // Otherwise, we'll just use the saturated color
  } else {
    colorBase = colorSaturated
  }

  return colorBase
}

export const getGrayScale = (color: HslType) => {
  // Percetage of lightness or darkness that will be increased next
  const ratio = 3
  const desaturatedColor = changeSaturation(color, 10)
  const grayScaleSet = {} as _any
  for (let i = 14; i > 0; i--) {
    grayScaleSet[`--color-light-gray-${i}`] = hslToHex(
      changeLightness(desaturatedColor, 54 + ratio * i),
    )
  }
  for (let i = 1; i < 14; i++) {
    grayScaleSet[`--color-dark-gray-${i}`] = hslToHex(
      changeLightness(desaturatedColor, 46 - ratio * i),
    )
  }
  return grayScaleSet
}

export const getColorPalette = (hex: string) => {
  let colorPalette = {} as _any
  const pureTone = balanceColor(hex)
  // The pure color is perfect to create the grayscale, but it is too bright
  // for highlighting the UI. So we'll get a slightly darker version of it.
  // const accent = hslToHex(darken(pureTone, 20))
  const pureToneHex = hslToHex(pureTone)
  colorPalette['--primary-color'] = pureToneHex
  colorPalette['--primary-color-hover'] = hslToHex(darken(pureTone, 10))
  colorPalette['--primary-color-active'] = hslToHex(darken(pureTone, 20))
  colorPalette['--primary-background-color'] = setOpacity(pureToneHex, 0.12)
  colorPalette = {
    ...colorPalette,
    ...getGrayScale(pureTone),
  }
  return colorPalette
}

export const toKebabCase = (str: string) =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map(x => x.toLowerCase())
    .join('-')

// export const sortAddonItems = (
//   items: (AddonItem | JSX.Element | null | boolean)[],
// ): (AddonItem | JSX.Element)[] => {
//   return items
//     .sort((a, b) => {
//       const aPosition =
//         a && typeof a !== 'boolean' && 'position' in a && a.position !== undefined
//           ? a.position
//           : undefined
//       const bPosition =
//         b && typeof b !== 'boolean' && 'position' in b && b.position !== undefined
//           ? b.position
//           : undefined

//       // Check if both objects have the 'position' property
//       if (typeof aPosition === 'number' && typeof bPosition === 'number') {
//         // Compare by 'position' if both have it
//         return aPosition - bPosition
//       }

//       // If one of them doesn't have 'position', place it after the one with 'position'
//       if (aPosition === undefined) {
//         return 1 // Move 'a' to a higher index (after 'b')
//       } else {
//         return -1 // Move 'b' to a higher index (after 'a')
//       }
//     })

//     .filter((item): item is AddonItem | JSX.Element => !!item)
// }
