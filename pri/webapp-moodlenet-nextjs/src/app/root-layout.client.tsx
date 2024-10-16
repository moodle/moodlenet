'use client'

import { PropsWithChildren } from 'react'
import { GlobalCtx } from '../lib/client/globalContexts'

export type GlobalProviderDeps = Pick<GlobalCtx, keyof GlobalCtx>

export function GlobalProvider({
  children,
  ctxDeps,
}: PropsWithChildren<{ ctxDeps: GlobalProviderDeps }>) {
  return <GlobalCtx.Provider value={{ ...ctxDeps }}>{children}</GlobalCtx.Provider>
}
