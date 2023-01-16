import { createContext, useContext } from 'react'
import type { WebPkgDeps } from '../../common/types.mjs'
import type { PkgContextT } from '../types/plugins.mjs'

export const PkgContext = createContext<PkgContextT<WebPkgDeps>>(null as never)
export function usePkgContext<PkgCtx extends PkgContextT<WebPkgDeps>>(): PkgCtx {
  const pkgContext = useContext(PkgContext)
  if (!pkgContext) {
    throw new Error(
      `no PkgContext available, you should call usePkgContext in your MainComponent only`,
    )
  }
  return pkgContext as PkgCtx
}
