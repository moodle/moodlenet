import debounce from 'lodash/debounce.js'
import { useContext, useEffect, useMemo, useState } from 'react'
import {
  CollectionActions,
  CollectionFormProps,
  CollectionMainProps,
  CollectionProps,
} from '../common/types.mjs'
import { MainContext } from './MainContext.js'

type SaveState = { form: boolean; image: boolean }
type myProps = { collectionKey: string }
export const useMainHook = ({ collectionKey }: myProps): CollectionMainProps | null => {
  const { rpcCaller } = useContext(MainContext)
  const [collection, setCollection] = useState<CollectionProps | null>()
  const [saved, setSaved] = useState({ data: false, image: false })

  useEffect(() => {
    rpcCaller.get(collectionKey).then(data => setCollection(data))
  }, [collectionKey, rpcCaller, setCollection])

  const actions = useMemo((): CollectionActions => {
    const setterSave = (key: keyof SaveState, val: boolean) => setSaved({ ...saved, [key]: val })
    const updateCollection = <T,>(state: keyof SaveState, key: string, val: T): T => (
      collection && setCollection({ ...collection, [key]: val }), setterSave(state, false), val
    )
    const updateData = <T,>(key: string, val: T): typeof collection =>
      collection && { ...collection, data: { ...collection.data, [key]: val } }

    const updateImageUrl = (imageUrl: string) => {
      setterSave('image', false)
      setCollection(updateData('imageUrl', imageUrl))
    }

    const { _delete, edit, setIsPublished, setImage } = rpcCaller
    return {
      async editData(res: CollectionFormProps) {
        setterSave('form', true)
        debounce(() => edit(collectionKey, res).then(() => updateCollection('form', 'form', false))) // edit(collectionKey, file).then(() => setterSave('data', false))
      },
      async setImage(file: File) {
        setterSave('image', true)
        setImage(collectionKey, file).then(updateImageUrl)
      },
      deleteCollection: () => _delete(collectionKey),
      publish: () => setIsPublished(collectionKey, true),
      unpublish: () => setIsPublished(collectionKey, false),
    }
  }, [collection, collectionKey, rpcCaller, saved])

  return useMemo<CollectionMainProps | null>(
    () => (!collection ? null : { actions, props: collection, saveState: saved }),
    [actions, collection, saved],
  )
}
