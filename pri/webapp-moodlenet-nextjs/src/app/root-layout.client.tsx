'use client'

import { appDeployemnts } from 'domain/src/env'
import { createContext, PropsWithChildren } from 'react'

// export interface GlobalCtx {}
export type GlobalCtx = {
  deployments: appDeployemnts
}
export const GlobalCtx = createContext<GlobalCtx>(null as any)
export function GlobalProviders({
  children,
  deployments,
}: PropsWithChildren<{ deployments: appDeployemnts }>) {
  return <GlobalCtx.Provider value={{ deployments }}>{children}</GlobalCtx.Provider>
}
