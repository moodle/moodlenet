import { ReactElement } from 'react'
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

export const isAddonPositionedItem = (
  toBeDetermined: AddonItem,
): toBeDetermined is AddonPositionedItem => {
  const toDetermine = (toBeDetermined as AddonPositionedItem).position
  if (toDetermine || toDetermine === 0) {
    return true
  }
  return false
}

export const isAddonItem = (
  toBeDetermined: AddonItem | undefined | false | null,
): toBeDetermined is AddonItem => {
  const toDetermine = toBeDetermined as AddonItem
  if (toDetermine || toDetermine === 0) {
    return true
  }
  return false
}

export const positionAddonItems = (items: AddonItem[]): AddonPositionedItem[] => {
  return items.map((item, i) => (isAddonPositionedItem(item) ? item : { Item: item, position: i }))
}

export const addonItemToReactElements = (items: AddonItem[]): ReactElement[] => {
  return items.map(item => (isAddonPositionedItem(item) ? item.Item : item))
}

export const sortAddonItems = (items: (AddonItem | undefined | false | null)[]): ReactElement[] => {
  return addonItemToReactElements(
    positionAddonItems(items.filter(isAddonItem)).sort(
      (a, b) =>
        (isAddonPositionedItem(a) ? a.position : 0) - (isAddonPositionedItem(b) ? b.position : 0),
    ),
  )
}
