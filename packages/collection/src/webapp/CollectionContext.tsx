import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useMemo } from 'react'
import { getCollectionHomePageRoutePath } from '../common/webapp-routes.mjs'
import { MainContext } from './MainContext.js'

export type CollectionContextT = {
  createCollection(): Promise<{ homePath: string }>
}
export const CollectionContext = createContext<CollectionContextT>(null as any)

export function useCollectionContextValue() {
  const { rpcCaller } = useContext(MainContext)

  const createCollection = useCallback<CollectionContextT['createCollection']>(
    async function createCollection() {
      const { _key } = await rpcCaller.create()
      return { homePath: getCollectionHomePageRoutePath({ _key, title: 'no name' }) }
    },
    [rpcCaller],
  )

  const collectionContext = useMemo<CollectionContextT>(() => {
    const collectionContext: CollectionContextT = {
      createCollection,
    }
    return collectionContext
  }, [createCollection])

  return collectionContext
}

export const CollectionContextProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const collectionContext = useCollectionContextValue()
  return (
    <CollectionContext.Provider value={collectionContext}>{children}</CollectionContext.Provider>
  )
}
