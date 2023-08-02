import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  CollectionActions,
  CollectionDataProps,
  CollectionFormProps,
  CollectionMainProps,
  CollectionRpc,
  SaveState,
} from '../common/types.mjs'
import { MainContext } from './MainContext.js'
import { createTaskerHook } from './pending-tasks.mjs'

// type PendingImage = {
//   pendingPromise: Promise<string | null>
//   file: File
// }
const [useUpImageTasker] = createTaskerHook<string | null, { file: File }>()

type myProps = { collectionKey: string }
export const useMainHook = ({ collectionKey }: myProps): CollectionMainProps | null | undefined => {
  const { rpcCaller } = useContext(MainContext)
  const nav = useNavigate()
  const [collection, setCollection] = useState<CollectionRpc | null>()
  const [isToDelete, setIsToDelete] = useState(false)
  const [isPublished, setIsPublish] = useState(false)

  const updateDataProp = useCallback(
    <K extends keyof CollectionDataProps>(k: K, v: CollectionDataProps[K]) =>
      setCollection(coll => coll && { ...coll, data: { ...coll.data, [k]: v } }),
    [],
  )
  const updateImageUrl = useCallback(
    (imageUrl: string | null) =>
      updateDataProp('image', imageUrl ? { credits: null, location: imageUrl } : null),
    [updateDataProp],
  )
  const setterSave = useCallback(
    (key: keyof SaveState, val: boolean) =>
      setSaved(currentSaved => ({ ...currentSaved, [key]: val })),
    [],
  )
  const [upImageTaskSet, upImageTaskCurrent] = useUpImageTasker(collectionKey, res => {
    console.log('hook task resolve', res)
    if (res.type === 'resolved') {
      updateImageUrl(res.value)
      setterSave('image', false)
    }
  })
  const [saveState, setSaved] = useState(() => ({ form: false, image: !!upImageTaskCurrent }))

  useEffect(() => {
    setCollection(undefined)
    rpcCaller.get(collectionKey).then(res => {
      res && setIsPublish(res.state.isPublished)
      setCollection(res)
    })
  }, [collectionKey, rpcCaller])

  // const formSaved = useCallback((form: boolean): void => setterSave('form', form), [setterSave])

  const actions = useMemo((): CollectionActions => {
    /* const updateCollection = <T,>(state: keyof SaveState, key: string, val: T): T => (
      collection && setCollection({ ...collection, [key]: val }), setterSave(state, false), val
    ) */

    const { _delete, edit: editRpc, setIsPublished, setImage } = rpcCaller

    return {
      async editData(res: CollectionFormProps) {
        setterSave('form', true)
        editRpc(collectionKey, res)
          .then(() => {
            setterSave('form', false)
          })
          .catch(() => void 0)
      },
      async setImage(file: File | null | undefined) {
        setterSave('image', true)
        const setImagePromise = setImage(collectionKey, file)
        file && upImageTaskSet(setImagePromise, { file })
      },
      deleteCollection: () => {
        setIsToDelete(true)
        return _delete(collectionKey).then(() => {
          setIsToDelete(true)
          nav(-1)
        })
      },
      removeResource: (resourceKey: string) => {
        return rpcCaller.actionResorce(collectionKey, 'remove', resourceKey).then(() => {
          setCollection(curr => {
            if (!curr) {
              return curr
            }
            return {
              ...curr,
              resourceList: curr.resourceList.filter(item => item._key !== resourceKey),
            }
          })
        })
      },
      publish: () => {
        setIsPublish(true)
        setIsPublished(collectionKey, true)
      },
      unpublish: () => {
        setIsPublish(false)
        setIsPublished(collectionKey, false)
      },
    }
  }, [collectionKey, nav, rpcCaller, setterSave, upImageTaskSet])

  const upImageTaskCurrentFile = upImageTaskCurrent?.ctx.file
  return useMemo<CollectionMainProps | null | undefined>(
    () =>
      !collection
        ? collection
        : {
            actions,
            props: {
              ...collection,
              state: { ...collection.state, isPublished },
              data: {
                ...collection.data,
                image: upImageTaskCurrentFile
                  ? { location: upImageTaskCurrentFile, credits: null }
                  : collection.data.image,
              },
            },
            saveState,
            isToDelete,
            isSaving: saveState.form || saveState.image,
          },
    [actions, collection, isPublished, isToDelete, saveState, upImageTaskCurrentFile],
  )
}
