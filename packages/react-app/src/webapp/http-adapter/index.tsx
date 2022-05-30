import { createContext, FC, PropsWithChildren, useMemo } from 'react'
import { sub } from './xhr-adapter'

interface CtxT {
  sub: typeof sub
}

export type HttpAdapterCtx = typeof HttpAdapterCtx
export const HttpAdapterCtx = createContext<CtxT>({ sub })
export const ProvideHttpAdapterCtx: FC<PropsWithChildren<{}>> = ({ children }) => {
  const ctx = useMemo<CtxT>(() => {
    return {
      sub,
    }
  }, [])
  return <HttpAdapterCtx.Provider value={ctx}>{children}</HttpAdapterCtx.Provider>
}
