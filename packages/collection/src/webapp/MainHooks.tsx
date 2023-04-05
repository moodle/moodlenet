import { useContext, useEffect, useMemo, useState } from 'react'
import {
  CollectionActions,
  CollectionFormProps,
  CollectionMainProps,
  CollectionProps,
} from '../common/types.mjs'

import { MainContext } from './MainContext.js'

type myProps = { collectionKey: string }
export const useMainHook = ({ collectionKey }: myProps): CollectionMainProps | null => {
  const { rpcCaller } = useContext(MainContext)
  const [collection, setCollection] = useState<CollectionProps | null>()

  useEffect(() => {
    rpcCaller.get(collectionKey).then(data => setCollection(data))
  }, [collectionKey, rpcCaller, setCollection])

  const actions = useMemo((): CollectionActions => {
    // const updateRespForm = (resourceForm: CollectionFormProps) => (
    //   collection && setCollection(current => current && { ...current, resourceForm }), resourceForm
    // )
    const { _delete, edit, setIsPublished, setImage } = rpcCaller

    const actions: CollectionActions = {
      editData: async (res: CollectionFormProps) => edit(collectionKey, res),
      deleteCollection: () => _delete(collectionKey),
      publish: () => setIsPublished(collectionKey, true),
      unpublish: () => setIsPublished(collectionKey, false),
      setImage: (file: File) => setImage(collectionKey, file),
    }
    return actions
  }, [collectionKey, rpcCaller])

  return useMemo<CollectionMainProps | null>(
    () => (!collection ? null : { actions, props: collection }),
    [actions, collection],
  )
}
