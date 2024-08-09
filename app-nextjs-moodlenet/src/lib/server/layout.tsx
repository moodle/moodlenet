/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, createElement, ReactNode } from 'react'
import { layoutSlots, slotItem } from './types/webapp-config'
import { serverUtils } from './utils'

export default function layout(LayoutCmp: ComponentType<any>) {
  return async function Layout(props: any) {
    return <LayoutCmp {...props} />
  }
}

export async function layoutUtils(props: Record<string, ReactNode>) {
  const srvUtils = await serverUtils()
  return { slotItems, slots, ...srvUtils }
  function slots<S extends layoutSlots>(slots: S): Record<keyof S, ReactNode[]> {
    return Object.entries(slots).reduce(
      (_, [k, items]) => ((_[k as keyof S] = slotItems(items)), _),
      {} as Record<keyof S, ReactNode[]>,
    )
  }
  function slotItems<S extends slotItem[]>(items: S | null | undefined) {
    const res = (items ?? []).map(item =>
      typeof item === 'string'
        ? props[item]
        : createElement(item.type, { key: item.key, ...item.props }),
    )
    return res
  }
}
