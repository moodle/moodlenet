import { PkgIdentifier } from '@moodlenet/core'
import { createContext, useContext } from 'react'
import { WebPkgDeps } from '../../common/types.mjs'
import { PkgContextT } from '../types/plugins.mjs'

export const PkgContext = createContext<PkgContextT<PkgIdentifier, WebPkgDeps>>(null as never)
export function usePkgContext<PkgCtx extends PkgContextT<PkgIdentifier, WebPkgDeps>>(): PkgCtx {
  const pkgContext = useContext(PkgContext)
  if (!pkgContext) {
    throw new Error(
      `no PkgContext available, you should call usePkgContext in your MainComponent only`,
    )
  }
  return pkgContext as PkgCtx
}
