import { createContext, FC, PropsWithChildren, useMemo } from 'react'
import { OpenIdContext, OpenIdPkgContext } from '../common/webapp/types.mjs'

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
