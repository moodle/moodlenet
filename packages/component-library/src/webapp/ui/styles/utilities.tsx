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

export const setOpacity = (color: string, opacity: number): string => {
  // coerce values so ti is between 0 and 1.
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255)
  return color + _opacity.toString(16).toUpperCase()
}

export const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`

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

type HslType = { h: number; s: number; l: number }

// const rgbToString = (rgb: RgbType): string => {
//   const { r, g, b } = rgb
//   return 'rgb(' + r + ' ' + g + ' ' + g + ')'
// }

const hslToRgb = (hsl: HslType): RgbType => {
  let { h, s, l } = hsl

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
  let { h, s, l } = hsl
  l = l * ((100 - i) / 100)
  return { h, s, l }
}
export const lighten = (hsl: HslType, i: number): HslType => {
  let { h, s, l } = hsl
  const newL = (l * (100 + i)) / 100
  l = newL > 100 ? 100 : newL
  return { h, s, l }
}
export const saturate = (hsl: HslType, i: number): HslType => {
  let { h, s, l } = hsl
  const newS = s * ((100 + i) / 100)
  l = newS > 100 ? 100 : newS
  return { h, s, l }
}
export const desaturate = (hsl: HslType, i: number): HslType => {
  let { h, s, l } = hsl
  s = s * ((100 - i) / 100)
  return { h, s, l }
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
  const grayScaleSet = {} as any
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
  let colorPalette = {} as any
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
