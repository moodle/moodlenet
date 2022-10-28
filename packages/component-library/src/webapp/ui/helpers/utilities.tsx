import { ReactNode } from 'react'
import { AddonItem, AddonPositionedItem } from '../types.js'

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

export const determineIfAddonPositionedItem = (
  toBeDetermined: AddonItem,
): toBeDetermined is AddonPositionedItem => {
  const toDetermine = (toBeDetermined as AddonPositionedItem).position
  if (toDetermine || toDetermine === 0) {
    return true
  }
  return false
}

export const positionAddonItems = (items: AddonItem[]): AddonPositionedItem[] => {
  return items.map((item, i) =>
    determineIfAddonPositionedItem(item) ? item : { item: item, position: i },
  )
}

export const addonItemToReactNodes = (items: AddonItem[]): ReactNode[] => {
  return items.map(item => (determineIfAddonPositionedItem(item) ? item.item : item))
}

export const sortAddonItems = (items: AddonItem[]): ReactNode[] => {
  return addonItemToReactNodes(
    positionAddonItems(items.filter(item => item !== null && item !== undefined)).sort(
      (a, b) =>
        (determineIfAddonPositionedItem(a) ? a.position : 0) -
        (determineIfAddonPositionedItem(b) ? b.position : 0),
    ),
  )
}
