import { useContext, useEffect, useMemo, useState } from 'react'
import {
  CollectionActions,
  CollectionDataResponce,
  CollectionFormValues,
  MainPropsCollection,
} from '../common/types.mjs'

import { MainContext } from './MainContext.js'

type myProps = { collectionKey: string }
export const useMainHook = ({ collectionKey }: myProps): MainPropsCollection | null => {
  const { rpcCaller } = useContext(MainContext)
  const [collection, setCollection] = useState<CollectionDataResponce | null>()

  useEffect(() => {
    rpcCaller.get(collectionKey).then(data => setCollection(data))
  }, [collectionKey, rpcCaller, setCollection])

  const actions = useMemo((): CollectionActions => {
    const updateRespForm = (resourceForm: CollectionFormValues) => (
      collection && setCollection(current => current && { ...current, resourceForm }), resourceForm
    )
    const { _delete, edit, setIsPublished, setImage } = rpcCaller
    const brk = (_: unknown): Promise<void> => new Promise(resolve => _ || resolve())

    const actions: CollectionActions = {
      editData: async (res: CollectionFormValues) =>
        brk(await edit(collectionKey, res).then(updateRespForm)),
      deleteCollection: () => brk(_delete(collectionKey)),
      publish: () => brk(setIsPublished(collectionKey, true)),
      unpublish: () => brk(setIsPublished(collectionKey, false)),
      setImage: (file: File) => brk(setImage(collectionKey, file)),
    }
    return actions
  }, [collectionKey, collection, rpcCaller])

  return useMemo<MainPropsCollection | null>(
    () => (!collection ? null : { actions, props: collection }),
    [actions, collection],
  )
}
