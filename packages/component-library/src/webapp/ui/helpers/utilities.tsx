import { ReactNode } from 'react'
import { AddonItem } from '../types.js'

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

export const getRandomInt = (max: number): number => Math.floor(Math.random() * max)

export const randomIntFromInterval = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const fileExceedsMaxUploadSize = (size: number, max: number | null) =>
  max === null ? false : size > max

export const positionAddonItems = (items: AddonItem[]): AddonItem[] => {
  return items.map((item, i) => (item.position ? item : { ...item, position: i }))
}

export const sortAddonItems = (items: AddonItem[]): AddonItem[] => {
  return positionAddonItems(items.filter(item => item !== null && item !== undefined)).sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0),
  )
}

export const AddonItemsToReactNodes = (items: AddonItem[]): ReactNode[] => {
  return items.map(({ Item, key }) => <Item key={key} />)
}
