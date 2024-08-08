'use server'

import { createElement, ReactNode } from 'react'
import { ServerContext } from './types/context'
import { SlotItem, Slots } from './types/webapp-config'

async function getCtx(): Promise<ServerContext> {
  // const X_CONTEXT_FACTORY_LOC = 'x-context-factory-loc'
  // const ctxLoc = process.env[X_CONTEXT_FACTORY_LOC]
  // return (ctxLoc ? await import(ctxLoc) : await import('#server/context-mock')).default[k]
  return (await import('@/lib-mock/server/context-mock')).default()
}

export async function layoutHelper(props: Record<string, ReactNode>) {
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
