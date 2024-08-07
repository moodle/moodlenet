'use server'

import { createElement, ReactNode } from 'react'
import { ServerContext } from './types/context'
import { SlotItem } from './types/webapp-config'

export async function ctx(): Promise<ServerContext> {
  // const X_CONTEXT_FACTORY_LOC = 'x-context-factory-loc'
  // const ctxLoc = process.env[X_CONTEXT_FACTORY_LOC]
  // return (ctxLoc ? await import(ctxLoc) : await import('#server/context-mock')).default[k]
  return (await import('#server/context-mock')).default
}

export async function layoutHelper(props: Record<string, ReactNode>) {
  return { slots }
  function slots(items: SlotItem[]) {
    const res = items.map(item =>
      typeof item === 'string'
        ? props[item]
        : createElement(item.type, { key: item.key, ...item.props }),
    )
    return res
  }
}
