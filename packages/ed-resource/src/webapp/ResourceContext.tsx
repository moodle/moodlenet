import { createContext, FC, PropsWithChildren, useContext, useMemo } from 'react'
import { MainContext } from './MainContext.js'

export type ResourceContextT = {
  create(): Promise<{ homePath: string }>
}
export const ResourceContext = createContext<ResourceContextT>(null as any)

export function useResourceContext() {
  const { rpcCaller } = useContext(MainContext)
  const resourceContext = useMemo<ResourceContextT>(() => {
    const resourceContext: ResourceContextT = {
      async create() {
        const { _key } = await rpcCaller.create()
        return { homePath: `/resource/${_key}` }
      },
    }
    return resourceContext
  }, [rpcCaller])
  return resourceContext
}

export const ResourceContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const resourceContext = useResourceContext()
  return <ResourceContext.Provider value={resourceContext}>{children}</ResourceContext.Provider>
}
