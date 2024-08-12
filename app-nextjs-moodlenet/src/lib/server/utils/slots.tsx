import { createElement, ReactNode } from 'react'
import { layoutSlots, slotItem } from '../session/types/misc'

type layoutProps = Record<string, ReactNode>

export function slots<S extends layoutSlots>(
  props: layoutProps,
  slots: S,
): Record<keyof S, ReactNode[]> {
  return Object.entries(slots).reduce(
    (_, [k, items]) => ((_[k as keyof S] = slotItems(props, items)), _),
    {} as Record<keyof S, ReactNode[]>,
  )
}

export function slotItems<S extends slotItem[]>(props: layoutProps, items: S | null | undefined) {
  const res = (items ?? []).map(item =>
    typeof item === 'string'
      ? props[item]
      : createElement(item.type, { key: item.key, ...item.props }),
  )
  return res
}
