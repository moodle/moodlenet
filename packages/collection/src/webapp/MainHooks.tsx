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
    const updateRespForm = (resourceForm: CollectionFormProps) => (
      collection && setCollection(current => current && { ...current, resourceForm }), resourceForm
    )
    const { _delete, edit, setIsPublished, setImage } = rpcCaller
    const brk = (_: unknown): Promise<void> => new Promise(resolve => _ || resolve())

    const actions: CollectionActions = {
      editData: async (res: CollectionFormProps) =>
        brk(await edit(collectionKey, res).then(dd => updateRespForm(dd))),
      deleteCollection: () => brk(_delete(collectionKey)),
      publish: () => brk(setIsPublished(collectionKey, true)),
      unpublish: () => brk(setIsPublished(collectionKey, false)),
      setImage: (file: File) => brk(setImage(collectionKey, file)),
    }
    return actions
  }, [collectionKey, collection, rpcCaller])

  return useMemo<CollectionMainProps | null>(
    () => (!collection ? null : { actions, props: collection }),
    [actions, collection],
  )
}
