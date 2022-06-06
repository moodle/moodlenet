import { ExtId } from '@moodlenet/kernel'
import { createContext, FC, PropsWithChildren, useMemo } from 'react'
import { ReactAppExt } from '../types'

interface CtxT {
  get<Def extends ReactAppExt = ReactAppExt>(id: Def['extId']): Def extends ReactAppExt<any, infer I> ? I : never
}

export type ExtInstancesCtx = typeof ExtInstancesCtx
export const ExtInstancesCtx = createContext<CtxT>(null as any)
export const ProvideExtInstancesContext: FC<
  PropsWithChildren<{
    extensionInstances: Record<ExtId, any>
  }>
> = ({ children, extensionInstances }) => {
  const get: CtxT['get'] = id => {
    const inst = extensionInstances[id]
    if (!inst) {
      throw new Error(`Ext instance for ${id} not found`)
    }
    return inst
  }

  const ctx = useMemo<CtxT>(() => {
    return {
      get,
    }
  }, [])
  return <ExtInstancesCtx.Provider value={ctx}>{children}</ExtInstancesCtx.Provider>
}
