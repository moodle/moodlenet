/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, createElement, ReactNode } from 'react'
import { getCtx } from './ctx'
import { SlotItem, Slots } from './types/webapp-config'

export default function layout(LayoutCmp: ComponentType<any>) {
  return async function Layout(props: any) {
    return <LayoutCmp {...props} />
  }
}

export async function utils(props: Record<string, ReactNode>) {
  const ctx = await getCtx()
  return { slotItems, slots, ctx }
  function slots<S extends Slots>(slots: S): Record<keyof S, ReactNode[]> {
    return Object.entries(slots).reduce(
      (_, [k, items]) => ((_[k as keyof S] = slotItems(items)), _),
      {} as Record<keyof S, ReactNode[]>,
    )
  }
  function slotItems<S extends SlotItem[]>(items: S) {
    const res = items.map(item =>
      typeof item === 'string'
        ? props[item]
        : createElement(item.type, { key: item.key, ...item.props }),
    )
    return res
  }
}
