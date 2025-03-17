'use client'

import { PropsWithChildren } from 'react'
import { globalCtx, GlobalCtx, sessionContext } from './globalContexts'

export function GlobalContextProvider({ children, sessionContext }: PropsWithChildren<{ sessionContext: sessionContext }>) {
  const globalCtx: globalCtx = {
    session: sessionContext,
  }
  return <GlobalCtx.Provider value={globalCtx}>{children}</GlobalCtx.Provider>
}
