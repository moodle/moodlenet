import { useImageUrl } from '@moodlenet/react-app/ui'
import { createTaskManager } from '@moodlenet/react-app/webapp'
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

// type PendingImage = {
//   pendingPromise: Promise<string | null>
//   file: File
// }
const [useUpImageTasks] = createTaskManager<string | null, { file: File | null | undefined }>()

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
  const [upImageTaskSet, upImageTaskId, upImageTaskCurrent] = useUpImageTasks(
    collectionKey,
    res => {
      if (res.type === 'resolved') {
        updateDataProp('image', res.value ? { credits: null, location: res.value } : null)
      }
      setterSave('image', false)
    },
  )
  const [saveState, setSaved] = useState<SaveState>(() => ({
    form: false,
    image: !!upImageTaskCurrent,
  }))
  const setterSave = useCallback(
    (key: keyof SaveState, val: boolean) =>
      setSaved(currentSaved => ({ ...currentSaved, [key]: val })),
    [],
  )

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
      setImage(file: File | null | undefined) {
        setterSave('image', true)
        upImageTaskSet(setImage(collectionKey, file, upImageTaskId), { file })
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
  }, [collectionKey, nav, rpcCaller, setterSave, upImageTaskId, upImageTaskSet])

  const [upImageTaskCurrentObjectUrl] = useImageUrl(upImageTaskCurrent?.ctx.file)
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
                ...(upImageTaskCurrent
                  ? {
                      image: upImageTaskCurrentObjectUrl
                        ? { location: upImageTaskCurrentObjectUrl, credits: null }
                        : null,
                    }
                  : {}),
              },
            },
            saveState,
            isToDelete,
            isSaving: saveState.form || saveState.image,
          },
    [
      actions,
      collection,
      isPublished,
      isToDelete,
      saveState,
      upImageTaskCurrent,
      upImageTaskCurrentObjectUrl,
    ],
  )
}
