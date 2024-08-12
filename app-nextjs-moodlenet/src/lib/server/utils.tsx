import { createElement, ReactNode } from 'react'
import { getCtx } from './ctx'
import { layoutSlots, slotItem } from './types/website-config'

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

export async function serverUtils() {
  const ctx = await getCtx()
  return {
    ctx,
    currUser: {
      isGuest,
    },
  }
  function isGuest() {
    return ctx.session.currentUser.t === 'guest'
  }
}
