import debounce from 'lodash/debounce.js'
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
  const [saved] = useState({ form: false, image: false })

  useEffect(() => {
    rpcCaller.get(collectionKey).then(data => setCollection(data))
  }, [collectionKey, rpcCaller])

  // const setterSave = useCallback(
  //   (key: keyof SaveState, val: boolean) => setSaved({ ...saved, [key]: val }),
  //   [saved],
  // )
  // const formSaved = useCallback((form: boolean): void => setterSave('form', form), [setterSave])

  const actions = useMemo((): CollectionActions => {
    /* const updateCollection = <T,>(state: keyof SaveState, key: string, val: T): T => (
      collection && setCollection({ ...collection, [key]: val }), setterSave(state, false), val
    ) */
    // const setterSave = (key: keyof SaveState, val: boolean) => formSaved() // ({ ...saved, [key]: val })
    const { _delete, edit: editRpc, setIsPublished, setImage } = rpcCaller
    const edit = debounce(
      (res: CollectionFormProps) =>
        editRpc(collectionKey, res).then(() => console.log('debouce', res)),
      1000,
    )

    const updateData = <T,>(key: string, val: T): typeof collection =>
      collection && { ...collection, data: { ...collection.data, [key]: val } }

    const updateImageUrl = (imageUrl: string) => {
      // setterSave('image', false)
      setCollection(updateData('imageUrl', imageUrl))
    }

    return {
      async editData(res: CollectionFormProps) {
        // setterSave('form', true)
        edit(res)
      },
      async setImage(file: File) {
        //  setterSave('image', true)
        setImage(collectionKey, file).then(updateImageUrl)
      },
      deleteCollection: () => _delete(collectionKey),
      publish: () => setIsPublished(collectionKey, true),
      unpublish: () => setIsPublished(collectionKey, false),
    }
  }, [collection, collectionKey, rpcCaller])

  return useMemo<CollectionMainProps | null>(
    () => (!collection ? null : { actions, props: collection, saveState: saved }),
    [actions, collection, saved],
  )
}
