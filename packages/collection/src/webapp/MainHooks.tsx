import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  CollectionActions,
  CollectionFormProps,
  CollectionMainProps,
  CollectionRpc,
  SaveState,
} from '../common/types.mjs'
import { MainContext } from './MainContext.js'

type PendingImage = {
  p: Promise<string | null>
  file: File
}
const pendingImages: Record<string, PendingImage> = {}
// window.addEventListener('beforeunload', e => {
//   if (Object.keys(pendingImages).length) {
//     e.preventDefault()
//     e.returnValue = 'you have pending images to upload. if you leave now you will loose them.'
//     return e.returnValue
//   }
//   return
// })

// setInterval(() => console.log('pendingUpl', pendingImages['H16thtg4']?.image.file.name), 1000)
type myProps = { collectionKey: string }
export const useMainHook = ({ collectionKey }: myProps): CollectionMainProps | null | undefined => {
  const pendingImage = pendingImages[collectionKey]
  const { rpcCaller } = useContext(MainContext)
  const nav = useNavigate()
  const [collection, setCollection] = useState<CollectionRpc | null>()
  const [saveState, setSaved] = useState({ form: false, image: !!pendingImage })
  const [isToDelete, setIsToDelete] = useState(false)
  const [isPublished, setIsPublish] = useState(false)

  const updateData = useCallback(
    <T,>(key: string, val: T): typeof collection =>
      collection && { ...collection, data: { ...collection.data, [key]: val } },
    [collection],
  )
  const updateImageUrl = useCallback(
    (imageUrl: string | null) => {
      setCollection(updateData('imageUrl', imageUrl))
    },
    [updateData],
  )
  const setterSave = useCallback(
    (key: keyof SaveState, val: boolean) =>
      setSaved(currentSaved => ({ ...currentSaved, [key]: val })),
    [],
  )

  useEffect(() => {
    pendingImage?.p.then(imageUrl => {
      updateImageUrl(imageUrl)
      setterSave('image', false)
    })
  }, [pendingImage, setterSave, updateImageUrl])

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
        editRpc(collectionKey, res).then(() => {
          setterSave('form', false)
        })
      },
      async setImage(file: File | null | undefined) {
        setterSave('image', true)
        const editPromise = setImage(collectionKey, file)
          .then(imageUrl => {
            delete pendingImages[collectionKey]
            updateImageUrl(imageUrl)
            setterSave('image', false)
            return imageUrl
          })
          .catch(e =>
            //     e?.name === 'AbortError' ? null : null /* Promise.reject(e) */
            e?.code === DOMException.ABORT_ERR ? null : Promise.reject(e),
          )
        file && (pendingImages[collectionKey] = { file, p: editPromise })
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
  }, [collectionKey, nav, rpcCaller, setterSave, updateImageUrl])

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
                image: pendingImage?.file
                  ? { location: pendingImage.file, credits: null }
                  : collection.data.image,
              },
            },
            saveState,
            isToDelete,
            isSaving: saveState.form || saveState.image,
          },
    [actions, collection, isPublished, isToDelete, pendingImage?.file, saveState],
  )
}
