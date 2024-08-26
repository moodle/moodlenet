import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCollectionHomePageRoutePath } from '../common/webapp-routes.mjs'
import { MainContext } from './MainContext.js'
import { shell } from './shell.mjs'

export type CollectionContextT = {
  createCollection(): Promise<{ homePath: string; key: string }>
  rpc: typeof shell.rpc.me
}
export const CollectionContext = createContext<CollectionContextT>(null as any)

export function useCollectionContextValue() {
  const nav = useNavigate()

  const { rpcCaller } = useContext(MainContext)

  const createCollection = useCallback<CollectionContextT['createCollection']>(
    async function createCollection(opts?: { noNav?: boolean }) {
      const { _key } = await rpcCaller.create()
      const homePath = getCollectionHomePageRoutePath({ _key, title: 'no-name' })
      !opts?.noNav && nav(homePath)
      return { homePath, key: _key }
    },
    [rpcCaller, nav],
  )

  const collectionContext = useMemo<CollectionContextT>(() => {
    const collectionContext: CollectionContextT = {
      createCollection,
      rpc: shell.rpc.me,
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
