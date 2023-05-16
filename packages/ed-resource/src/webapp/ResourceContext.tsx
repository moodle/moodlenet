import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useMemo } from 'react'
import { getResourceHomePageRoutePath } from '../common/webapp-routes.mjs'
import { MainContext } from './MainContext.js'

export type ResourceContextT = {
  createResource(): Promise<{ homePath: string }>
}
export const ResourceContext = createContext<ResourceContextT>(null as any)

export function useResourceContextValue() {
  const mainContext = useContext(MainContext)

  const createResource = useCallback<ResourceContextT['createResource']>(
    async function create() {
      const { _key } = await mainContext.rpcCaller.create()
      return { homePath: getResourceHomePageRoutePath({ _key }) }
    },
    [mainContext.rpcCaller],
  )

  const resourceContext = useMemo<ResourceContextT>(() => {
    const resourceContext: ResourceContextT = {
      createResource,
    }
    return resourceContext
  }, [createResource])

  return resourceContext
}

export const ProvideResourceContext: FC<PropsWithChildren> = ({ children }) => {
  const resourceContext = useResourceContextValue()
  return <ResourceContext.Provider value={resourceContext}>{children}</ResourceContext.Provider>
}
