import type { FC, PropsWithChildren } from 'react'
import { createContext, useMemo } from 'react'
import type { OpenIdContext, OpenIdPkgContext } from './types.mjs'

export const OpenIdCtx = createContext<OpenIdContext>(null as any)
export const ProvideOpenIdContext: FC<PropsWithChildren<{ pkgContext: OpenIdPkgContext }>> = ({
  children,
  pkgContext,
}) => {
  const ctx = useMemo<OpenIdContext>(() => {
    return {
      pkg: pkgContext,
    }
  }, [pkgContext])
  return <OpenIdCtx.Provider value={ctx}>{children}</OpenIdCtx.Provider>
}
