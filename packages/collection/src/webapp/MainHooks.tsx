import debounce from 'lodash/debounce.js'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  CollectionActions,
  CollectionFormProps,
  CollectionMainProps,
  CollectionProps,
  SaveState,
} from '../common/types.mjs'
import { MainContext } from './MainContext.js'

type myProps = { collectionKey: string }
export const useMainHook = ({ collectionKey }: myProps): CollectionMainProps | null => {
  const { rpcCaller } = useContext(MainContext)
  const [collection, setCollection] = useState<CollectionProps | null>()
  const [saved, setSaved] = useState({ form: false, image: false })

  useEffect(() => {
    rpcCaller.get(collectionKey).then(data => setCollection(data))
  }, [collectionKey, rpcCaller])

  const setterSave = useCallback(
    (key: keyof SaveState, val: boolean) =>
      setSaved(currentSaved => ({ ...currentSaved, [key]: val })),
    [],
  )
  // const formSaved = useCallback((form: boolean): void => setterSave('form', form), [setterSave])

  const actions = useMemo((): CollectionActions => {
    /* const updateCollection = <T,>(state: keyof SaveState, key: string, val: T): T => (
      collection && setCollection({ ...collection, [key]: val }), setterSave(state, false), val
    ) */
    // const setterSave = (key: keyof SaveState, val: boolean) => formSaved() // ({ ...saved, [key]: val })
    const { _delete, edit: editRpc, setIsPublished, setImage } = rpcCaller
    const edit = debounce((res: CollectionFormProps) => {
      setterSave('form', true)
      editRpc(collectionKey, res).then(() => {
        setterSave('form', false)
      })
    }, 1000)

    const updateData = <T,>(key: string, val: T): typeof collection =>
      collection && { ...collection, data: { ...collection.data, [key]: val } }

    const updateImageUrl = (imageUrl: string) => {
      setCollection(updateData('imageUrl', imageUrl))
    }

    return {
      async editData(res: CollectionFormProps) {
        edit(res)
      },
      async setImage(file: File) {
        setterSave('image', true)
        setImage(collectionKey, file).then(imageUrl => {
          updateImageUrl(imageUrl)
          setterSave('image', false)
        })
      },
      deleteCollection: () => _delete(collectionKey),
      publish: () => setIsPublished(collectionKey, true),
      unpublish: () => setIsPublished(collectionKey, false),
    }
  }, [collection, collectionKey, rpcCaller, setterSave])

  useEffect(() => {
    console.log({ saved: JSON.stringify(saved) })
  }, [saved])

  return useMemo<CollectionMainProps | null>(
    () => (!collection ? null : { actions, props: collection, saveState: saved }),
    [actions, collection, saved],
  )
}
