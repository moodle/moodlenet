import { useContext, useEffect, useMemo, useState } from 'react'
import {
  CollectionActions,
  CollectionDataResponce,
  CollectionFormValues,
  MainPropsCollection,
} from '../common/types.mjs'

import { MainContext } from './MainContext.js'

export const useMainHook = ({
  collectionKey,
}: {
  collectionKey: string
}): MainPropsCollection | null => {
  const {
    rpcCaller,
    // auth: { isAdmin, isAuthenticated },
  } = useContext(MainContext)
  const [collection, setCollection] = useState<CollectionDataResponce>()

  useEffect(() => {
    rpcCaller.get(collectionKey).then(data => setCollection(data))
  }, [collectionKey, rpcCaller, setCollection])

  const actions = useMemo<CollectionActions>(() => {
    const updateRespForm = (resourceForm: CollectionFormValues | undefined) => (
      resourceForm &&
        collection &&
        setCollection(current => current && { ...current, resourceForm }),
      resourceForm
    )

    const { _delete, edit, setIsPublished, setImage } = rpcCaller
    const actions: CollectionActions = {
      editData: async (res: CollectionFormValues) => {
        await edit(collectionKey, res).then(updateRespForm)
      },
      deleteCollection: () => _delete(collectionKey),
      publish: () => setIsPublished(collectionKey, true),
      unpublish: () => setIsPublished(collectionKey, false),
      setImage: (file: File) => setImage(collectionKey, file),
    }
    return actions
  }, [collectionKey, collection, rpcCaller])

  return useMemo<MainPropsCollection | null>((): MainPropsCollection | null => {
    if (!collection || !actions) return null

    return {
      actions,
      props: collection,
    }
  }, [actions, collection])
}
