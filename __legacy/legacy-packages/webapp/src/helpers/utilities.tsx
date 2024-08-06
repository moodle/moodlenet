import { useHistory } from 'react-router'
import { ContentBackupImages } from '../ui/assets/data/images'
import { AssetInfo } from '../ui/types'

export const isURL = (str: string): boolean => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  return !!pattern.test(str)
}

export const isEmailAddress = (email: string): boolean => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export const randomIntFromInterval = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const elementFullyInViewPort = (
  el: Element,
  options?: {
    marginTop?: number
  }
): boolean => {
  let { left, top, right, bottom } = el.getBoundingClientRect()

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

export const getElementSize = (
  el: Element
): { width: number; height: number } => {
  const { left, top, right, bottom } = el.getBoundingClientRect()
  return {
    width: right - left,
    height: bottom - top,
  }
}

export const adjustColor = (color: string, amount: number) => {
  return (
    '#' +
    color
      .replace(/^#/, '')
      .replace(/../g, (color) =>
        (
          '0' +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  )
}

export const setOpacity = (color: string, opacity: number): string => {
  // coerce values so ti is between 0 and 1.
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255)
  return color + _opacity.toString(16).toUpperCase()
}

export const randomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`

export const getNumberFromString = (s: string) =>
  parseInt(
    s
      .split('')
      .map((l) => {
        return l.charCodeAt(0)
      })
      .join(''),
    10
  )

export const getBackupImage = (id: string): AssetInfo | undefined => {
  const numId = getNumberFromString(id)
  return ContentBackupImages[numId % ContentBackupImages.length]
}

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max)
}

export function useAutoImageAdded() {
  const history = useHistory()
  // console.log({ __: history.location.state })
  const get = () => !!(history.location.state as any)?.autoImageAdded
  const set = (autoImageAdded: boolean) => ({ autoImageAdded })
  return { get, set }
}

export const getYearList = (startYear: number): string[] => {
  const currentYear = new Date().getFullYear()
  const years = []
  while (startYear <= currentYear) {
    years.push((startYear++).toString())
  }
  return years.reverse()
}
