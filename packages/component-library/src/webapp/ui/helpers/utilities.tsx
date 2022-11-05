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

export const isPositionedItem = <T extends { position: number }>(
  toBeDetermined: unknown,
): toBeDetermined is T => {
  const toDetermine = (toBeDetermined as T).position
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

const iterateIndex = (list: number[], index: number): number =>
  list.includes(index) ? iterateIndex(list, index + 1) : index

export const positionAddonItems = (items: AddonItem[]): AddonPositionedItem[] => {
  const positions: number[] = items
    .map(item => isPositionedItem(item) && item.position)
    .filter((pos): pos is number => Number.isInteger(pos))
  let index = 0
  return items.map(item => {
    if (isPositionedItem(item)) {
      return item
    } else {
      const newIndex = iterateIndex(positions, index)
      index = newIndex + 1
      return { Item: item, position: newIndex }
    }
  })
}

export const sortItems = <T extends { position: number }>(items: T[]): T[] => {
  return items.sort((a, b) => a.position - b.position)
}

export const addonItemToReactElements = (items: AddonItem[]): ReactElement[] => {
  return items.map(item => (isPositionedItem(item) ? item.Item : item))
}

export const sortAddonItems = (items: (AddonItem | undefined | false | null)[]): ReactElement[] => {
  return addonItemToReactElements(sortItems(positionAddonItems(items.filter(isAddonItem))))
}
