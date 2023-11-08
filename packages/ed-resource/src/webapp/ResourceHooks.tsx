import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type {
  EditResourceFormRpc,
  EditResourceRespRpc,
  ResourceActions,
  ResourceDataProps,
  ResourceFormProps,
  ResourceProps,
  SaveState,
  SavingState,
} from '../common/types.mjs'

import { useImageUrl } from '@moodlenet/react-app/ui'
import { createTaskManager, silentCatchAbort } from '@moodlenet/react-app/webapp'
import { useNavigate } from 'react-router-dom'
import { MainContext } from './MainContext.js'

export type Actions = {
  editResource: (res: ResourceFormProps) => Promise<ResourceFormProps>
  getResource: () => Promise<ResourceProps>
  deleteResource: () => Promise<ResourceProps>
  setIsPublished: (approve: boolean) => Promise<ResourceProps>
}

export type ResourceCommonProps = {
  actions: ResourceActions
  props: ResourceProps
  saveState: SaveState
  isToDelete: boolean
}

const [useUploadImageTasks] = createTaskManager<
  EditResourceRespRpc,
  { file: File | null | undefined }
>()
const [useProvideResourceTasks] = createTaskManager<{ _key: string }, { content: string | File }>()

type myProps = { resourceKey: string }
export const useResourceBaseProps = ({ resourceKey }: myProps) => {
  const { rpcCaller } = useContext(MainContext)
  const nav = useNavigate()
  const [resource, setResource] = useState<ResourceProps | null>()

  const [isToDelete, setIsToDelete] = useState(false)
  const [isPublished, setIsPublish] = useState(false)

  useEffect(() => {
    setResource(undefined)
    rpcCaller
      .get(resourceKey)
      .then(res => {
        res && setIsPublish(res.state.isPublished)
        setResource(res)
      })
      .catch(silentCatchAbort)
  }, [resourceKey, rpcCaller])

  const setterSave = useCallback(
    (key: keyof SaveState, val: SavingState) =>
      setSaveState(currentSaved => ({ ...currentSaved, [key]: val })),
    [],
  )

  const updateDataProp = useCallback(
    <K extends keyof ResourceDataProps>(key: K, val: ResourceDataProps[K]) =>
      setResource(res => res && { ...res, data: { ...res.data, [key]: val } }),
    [],
  )
  const [upImageTaskSet, upImageTaskId, upImageTaskCurrent] = useUploadImageTasks(
    resourceKey,
    res => {
      if (res.type === 'resolved') {
        const { image, ...form } = res.value

        updateDataProp('image', image)
        setfo
      }
      setterSave('image', 'not-saving')
    },
  )
  function goToEditPage(_: string) {
    console.error(`goToEditPage not impl, res key ${_}`)
  }
  const [provideResourceTaskSet, provideResourceTaskId, provideResourceTaskCurrent] =
    useProvideResourceTasks(resourceKey, res => {
      if (res.type === 'resolved') {
        // const newContentLocal = res.ctx.content
        // const isFile = !!(newContentLocal instanceof Blob && res.value)
        // updateDataProp('contentType', isFile ? 'file' : 'link')
        // updateDataProp('contentUrl', res.value)
        // updateDataProp('downloadFilename', isFile ? newContentLocal.name : null)
        goToEditPage(res.value._key)
      }
      setterSave('content', 'not-saving')
    })

  const [saveState, setSaveState] = useState<SaveState>({
    form: 'not-saving',
    image: upImageTaskCurrent ? 'saving' : 'not-saving',
    content: provideResourceTaskCurrent ? 'saving' : 'not-saving',
  })

  const actions = useMemo<ResourceActions>(() => {
    const { edit, setIsPublished, create, trash } = rpcCaller

    const resourceActions: ResourceActions = {
      async editData(res: ResourceFormProps) {
        setterSave('form', 'saving')
        edit(resourceKey, res, `edit resource ${resourceKey} form`).then(() => {
          setterSave('form', 'save-done')
          setTimeout(() => setterSave('form', 'not-saving'), 100)
        }) // .then(form => updateResource('form', 'resourceForm', form)),
      },
      setImage(file: File | undefined | null) {
        setterSave('image', 'saving')
        const image: EditResourceFormRpc['image'] = !file
          ? { type: 'remove' }
          : { type: 'file', file }
        upImageTaskSet(edit(resourceKey, { image }, upImageTaskId), { file })
      },
      async provideContent(content: File | string) {
        setterSave('content', 'saving')

        provideResourceTaskSet(create(content, provideResourceTaskId), { content })
        // await setContent(resourceKey, content).then(updateDataProp('contentUrl'))
        // setterSave('content', false)
      },
      publish: () => {
        setIsPublish(true)
        setIsPublished(resourceKey, true)
      },
      unpublish: () => {
        setIsPublish(false)
        setIsPublished(resourceKey, false)
      },
      deleteResource: () => {
        setIsToDelete(true)
        return trash(resourceKey).then(() => {
          setIsToDelete(false)
          nav(-1)
        })
      },
    }
    return resourceActions
  }, [
    nav,
    resourceKey,
    rpcCaller,
    setterSave,
    upImageTaskId,
    upImageTaskSet,
    provideResourceTaskId,
    provideResourceTaskSet,
  ])

  const [upResourceTaskCurrentObjectUrl] = useImageUrl(provideResourceTaskCurrent?.ctx.content)
  const [upImageTaskCurrentObjectUrl] = useImageUrl(upImageTaskCurrent?.ctx.file)
  const upResourceTaskCurrentContent = provideResourceTaskCurrent?.ctx.content
  return useMemo<ResourceCommonProps | null | undefined>(
    () =>
      !resource
        ? resource
        : {
            actions,
            props: {
              ...resource,
              state: { ...resource.state, isPublished },
              data: {
                ...resource.data,
                ...(upImageTaskCurrent
                  ? {
                      image: upImageTaskCurrentObjectUrl
                        ? { location: upImageTaskCurrentObjectUrl, credits: null }
                        : null,
                    }
                  : {}),
                ...(provideResourceTaskCurrent
                  ? {
                      contentUrl: upResourceTaskCurrentObjectUrl,
                      downloadFilename:
                        upResourceTaskCurrentContent instanceof Blob
                          ? upResourceTaskCurrentContent.name
                          : null,
                      contentType: upResourceTaskCurrentContent instanceof Blob ? 'file' : 'link',
                    }
                  : {}),
              },
            },
            saveState,
            isToDelete,
          },
    [
      actions,
      isPublished,
      isToDelete,
      resource,
      saveState,
      upImageTaskCurrent,
      upImageTaskCurrentObjectUrl,
      provideResourceTaskCurrent,
      upResourceTaskCurrentContent,
      upResourceTaskCurrentObjectUrl,
    ],
  )
}
