import type { MySystemEntitiesId } from '@moodlenet/system-entities/webapp/rt'
import { useMySystemEntitiesId } from '@moodlenet/system-entities/webapp/rt'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useMemo } from 'react'
import type { EdResourceEntityNames } from '../common/types.mjs'
import { getResourceHomePageRoutePath } from '../common/webapp-routes.mjs'
import { MainContext } from './MainContext.js'
import { shell } from './shell.mjs'

export type ResourceContextT = {
  createResource(): Promise<{ homePath: string }>
  resourceEntitiesId: MySystemEntitiesId<EdResourceEntityNames>
}
export const ResourceContext = createContext<ResourceContextT>(null as any)

export function useResourceContextValue() {
  const mainContext = useContext(MainContext)

  const resourceEntitiesId = useMySystemEntitiesId<EdResourceEntityNames>(shell)

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
      resourceEntitiesId,
    }
    return resourceContext
  }, [createResource, resourceEntitiesId])

  return resourceContext
}

export const ProvideResourceContext: FC<PropsWithChildren> = ({ children }) => {
  const resourceContext = useResourceContextValue()
  return <ResourceContext.Provider value={resourceContext}>{children}</ResourceContext.Provider>
}
