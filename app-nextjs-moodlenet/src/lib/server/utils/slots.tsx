import { createElement, PropsWithChildren } from 'react'
import { layoutSlotItem } from '../session/types/misc'

export type layoutProps = Record<string, layoutSlotItem>
export type layoutPropsWithChildren = PropsWithChildren<layoutProps>
export function slots<S extends Record<string, layoutSlotItem[]>>(
  props: layoutProps,
  slots: S,
): Record<keyof S, layoutSlotItem[]> {
  return Object.entries(slots).reduce(
    (_, [k, items]) => ((_[k as keyof S] = slotItems(props, items)), _),
    {} as Record<keyof S, layoutSlotItem[]>,
  )
}

export function slotItems<S extends layoutSlotItem[]>(
  props: layoutProps,
  items: S | null | undefined,
) {
  const res = (items ?? []).map(item => slotItem(props, item)).filter(isLayoutSlotItem)
  return res
}

export function isLayoutSlotItem(value: layoutSlotItem | undefined): value is layoutSlotItem {
  return !!value
}

export function slotItem(props: layoutProps, item: layoutSlotItem) {
  return typeof item === 'string'
    ? props[item]
    : createElement(item.type, { key: item.key, ...item.props })
}
