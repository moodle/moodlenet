import { clientSlotItem } from '@/lib/common/pages'
import { createElement, PropsWithChildren, ReactElement } from 'react'
import { layoutSlotItem } from '../session/types/website/layouts'

export type layoutProps = Record<string, ReactElement>
export type layoutPropsWithChildren = PropsWithChildren<layoutProps>
export function slots<S extends Record<string, layoutSlotItem[]>>(props: layoutProps, slots: S) {
  return Object.entries(slots).reduce(
    (_, [k, items]) => ((_[k as keyof S] = slotItems(props, items)), _),
    {} as Record<keyof S, clientSlotItem[]>,
  )
}

export function slotItems<S extends layoutSlotItem[]>(
  props: layoutProps,
  items: S | null | undefined,
) {
  const res = (items ?? [])
    .map(item => slotItem(props, item))
    .filter((value): value is clientSlotItem => !!value)
  return res
}

export function isLayoutSlotItem(value: layoutSlotItem | undefined): value is layoutSlotItem {
  return !!value
}

export function slotItem(
  props: layoutProps,
  item: layoutSlotItem,
  _default: clientSlotItem = `SHOULD NEVER HAPPEN: NO SLOT ITEM for ${item}`,
) {
  return typeof item === 'string'
    ? (props[item] ?? _default)
    : createElement(item.type, { key: item.key, ...item.props })
}

// export function isParallelRouteItem(item: layoutSlotItem): item is parallelRouteItem {
//   return typeof item === 'object' && '@' in item && typeof item['@'] === 'string'
// }
// export function slotItem(
//   props: layoutProps,
//   item: layoutSlotItem,
//   _default: clientSlotItem = `SHOULD NEVER HAPPEN: NO SLOT ITEM for ${isParallelRouteItem(item) ? item['@'] : String(item)}`,
// ) {
//   return isParallelRouteItem(item)
//     ? (props[item['@']] ?? _default)
//     : typeof item === 'string'
//       ? item
//       : createElement(item.type, { key: item.key, ...item.props })
// }

// export function isParallelRouteItem(item: layoutSlotItem): item is parallelRouteItem {
//   return typeof item === 'object' && '@' in item && typeof item['@'] === 'string'
// }
