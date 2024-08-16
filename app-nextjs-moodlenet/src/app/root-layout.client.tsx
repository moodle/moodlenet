'use client'

import { createContext, PropsWithChildren } from 'react'

// export interface GlobalCtx {}
export type GlobalCtx = null
export const GlobalCtx = createContext<GlobalCtx>(null as any)
export function GlobalProviders({ children }: PropsWithChildren /* <{ sc: GlobalCtx }> */) {
  return <GlobalCtx.Provider value={null}>{children}</GlobalCtx.Provider>
}
