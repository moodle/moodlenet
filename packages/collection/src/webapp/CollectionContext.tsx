import type { MySystemEntitiesId } from '@moodlenet/system-entities/webapp/rt'
import { useMySystemEntitiesId } from '@moodlenet/system-entities/webapp/rt'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useMemo } from 'react'
import type { CollectionEntityNames } from '../common/types.mjs'
import { getCollectionHomePageRoutePath } from '../common/webapp-routes.mjs'
import { MainContext } from './MainContext.js'

export type CollectionContextT = {
  createCollection(): Promise<{ homePath: string }>
  collectionEntitiesId: MySystemEntitiesId<CollectionEntityNames>
}
export const CollectionContext = createContext<CollectionContextT>(null as any)

export function useCollectionContextValue() {
  const { rpcCaller } = useContext(MainContext)
  const collectionEntitiesId = useMySystemEntitiesId<CollectionEntityNames>()

  const createCollection = useCallback<CollectionContextT['createCollection']>(
    async function createCollection() {
      const { _key } = await rpcCaller.create()
      return { homePath: getCollectionHomePageRoutePath({ _key }) }
    },
    [rpcCaller],
  )

  const collectionContext = useMemo<CollectionContextT>(() => {
    const collectionContext: CollectionContextT = {
      createCollection,
      collectionEntitiesId,
    }
    return collectionContext
  }, [createCollection, collectionEntitiesId])

  return collectionContext
}

export const CollectionContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const collectionContext = useCollectionContextValue()
  return (
    <CollectionContext.Provider value={collectionContext}>{children}</CollectionContext.Provider>
  )
}
