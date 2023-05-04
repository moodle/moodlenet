import debounce from 'lodash/debounce.js'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
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
  const nav = useNavigate()
  const [collection, setCollection] = useState<CollectionProps | null>()
  const [saveState, setSaved] = useState({ form: false, image: false })
  const [isToDelete, setIsToDelete] = useState(false)
  const [isPublished, setIsPublish] = useState(false)

  useEffect(() => {
    rpcCaller.get(collectionKey).then(res => {
      res && setIsPublish(res.state.isPublished)
      setCollection(res)
    })
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

    const { _delete, edit: editRpc, setIsPublished, setImage } = rpcCaller
    const edit = debounce((res: CollectionFormProps) => {
      editRpc(collectionKey, res).then(() => {
        setterSave('form', false)
      })
    }, 1000)

    const updateData = <T,>(key: string, val: T): typeof collection =>
      collection && { ...collection, data: { ...collection.data, [key]: val } }

    const updateImageUrl = (imageUrl: string | null) => {
      setCollection(updateData('imageUrl', imageUrl))
    }

    return {
      async editData(res: CollectionFormProps) {
        setterSave('form', true)
        edit(res)
      },
      async setImage(file: File | null | undefined) {
        //@ETTO make sure this null // undefined is useful for deleting images
        setterSave('image', true)
        setImage(collectionKey, file).then(imageUrl => {
          updateImageUrl(imageUrl)
          setterSave('image', false)
        })
      },
      deleteCollection: () => {
        setIsToDelete(true)
        return _delete(collectionKey).then(() => {
          setIsToDelete(true)
          nav('/')
        })
      },
      toggleFollow: () => alert('not implemented'), //@ETTO to implement
      toggleBookmark: () => alert('not implemented'), //@ETTO to implement
      publish: () => setIsPublished(collectionKey, true),
      unpublish: () => setIsPublished(collectionKey, false),
    }
  }, [collection, collectionKey, nav, rpcCaller, setterSave])

  return useMemo<CollectionMainProps | null>(
    () =>
      !collection
        ? null
        : {
            actions,
            props: { ...collection, state: { ...collection.state, isPublished } },
            saveState,
            isToDelete,
            isSaving: saveState.form || saveState.image,
          },
    [actions, collection, isPublished, isToDelete, saveState],
  )
}
