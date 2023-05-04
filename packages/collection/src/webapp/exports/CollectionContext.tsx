import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { MainContext } from '../MainContext.js'

export type CollectionContextT = {
  create(): Promise<{ homePath: string }>
}
export const CollectionContext = createContext<CollectionContextT>(null as any)

export function useCollectionContext() {
  const { rpcCaller } = useContext(MainContext)
  const collectionContext = useMemo<CollectionContextT>(() => {
    const collectionContext: CollectionContextT = {
      async create() {
        const { _key } = await rpcCaller.create()
        return { homePath: `/collection/${_key}` }
      },
    }
    return collectionContext
  }, [rpcCaller])
  return collectionContext
}

export const CollectionContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const collectionContext = useCollectionContext()
  return (
    <CollectionContext.Provider value={collectionContext}>{children}</CollectionContext.Provider>
  )
}
