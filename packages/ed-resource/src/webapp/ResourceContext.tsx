import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getResourceHomePageRoutePath } from '../common/webapp-routes.mjs'
import { MainContext } from './MainContext.js'
import { shell } from './shell.mjs'

export type ResourceContextT = {
  createResource(): Promise<{ homePath: string; key: string }>
  rpc: typeof shell.rpc.me
}
export const ResourceContext = createContext<ResourceContextT>(null as any)

export function useResourceContextValue() {
  const mainContext = useContext(MainContext)
  const nav = useNavigate()

  const createResource = useCallback<ResourceContextT['createResource']>(
    async function create(opts?: { noNav?: boolean }) {
      const { _key } = await mainContext.rpcCaller.create()
      const homePath = getResourceHomePageRoutePath({ _key, title: 'no-name' })
      !opts?.noNav && nav(homePath)
      return { homePath, key: _key }
    },
    [mainContext.rpcCaller, nav],
  )

  const resourceContext = useMemo<ResourceContextT>(() => {
    const resourceContext: ResourceContextT = {
      createResource,
      rpc: shell.rpc.me,
    }
    return resourceContext
  }, [createResource])

  return resourceContext
}

export const ProvideResourceContext: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const resourceContext = useResourceContextValue()
  return <ResourceContext.Provider value={resourceContext}>{children}</ResourceContext.Provider>
}
