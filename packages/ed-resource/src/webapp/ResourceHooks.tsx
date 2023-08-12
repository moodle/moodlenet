import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type {
  ResourceActions,
  ResourceDataProps,
  ResourceFormProps,
  ResourceProps,
} from '../common/types.mjs'

import { useImageUrl } from '@moodlenet/react-app/ui'
import { createTaskManager } from '@moodlenet/react-app/webapp'
import { useNavigate } from 'react-router-dom'
import type { SaveState } from './exports/ui.mjs'
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

const [useUpImageTasks] = createTaskManager<string | null, { file: File | null | undefined }>()
const [useUpResourceTasks] = createTaskManager<
  string | null,
  { content: string | File | null | undefined }
>()

type myProps = { resourceKey: string }
export const useResourceBaseProps = ({ resourceKey }: myProps) => {
  const { rpcCaller } = useContext(MainContext)
  const nav = useNavigate()
  const [resource, setResource] = useState<ResourceProps | null>()

  const [isToDelete, setIsToDelete] = useState(false)
  const [isPublished, setIsPublish] = useState(false)

  useEffect(() => {
    setResource(undefined)
    rpcCaller.get(resourceKey).then(res => {
      res && setIsPublish(res.state.isPublished)
      setResource(res)
    })
  }, [resourceKey, rpcCaller])

  const setterSave = useCallback(
    (key: keyof SaveState, val: boolean) =>
      setSaveState(currentSaved => ({ ...currentSaved, [key]: val })),
    [],
  )

  const updateDataProp = useCallback(
    <K extends keyof ResourceDataProps>(key: K, val: ResourceDataProps[K]) =>
      setResource(res => res && { ...res, data: { ...res.data, [key]: val } }),
    [],
  )
  const [upImageTaskSet, upImageTaskId, upImageTaskCurrent] = useUpImageTasks(resourceKey, res => {
    if (res.type === 'resolved') {
      updateDataProp('image', res.value ? { credits: null, location: res.value } : null)
    }
    setterSave('image', false)
  })

  const [upResourceTaskSet, upResourceTaskId, upResourceTaskCurrent] = useUpResourceTasks(
    resourceKey,
    res => {
      if (res.type === 'resolved') {
        const newContent = res.ctx.content
        const isFile = !!(newContent instanceof Blob && res.value)
        updateDataProp('contentType', isFile ? 'file' : 'link')
        updateDataProp('contentUrl', res.value)
        updateDataProp('downloadFilename', isFile ? newContent.name : null)
      }
      setterSave('content', false)
    },
  )

  const [saveState, setSaveState] = useState<SaveState>({
    form: false,
    image: !!upImageTaskCurrent,
    content: !!upResourceTaskCurrent,
  })

  const actions = useMemo<ResourceActions>(() => {
    const { edit: editRpc, setImage, setIsPublished, setContent, _delete } = rpcCaller

    const resourceActions: ResourceActions = {
      async editData(res: ResourceFormProps) {
        setterSave('form', true)
        editRpc(resourceKey, res).then(() => {
          setterSave('form', false)
        }) // .then(form => updateResource('form', 'resourceForm', form)),
      },
      setImage(file: File | undefined | null) {
        setterSave('image', true)
        upImageTaskSet(setImage(resourceKey, file, upImageTaskId), { file })
      },
      async setContent(content: File | string | undefined | null) {
        setterSave('content', true)

        upResourceTaskSet(setContent(resourceKey, content, upResourceTaskId), { content })
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
        return _delete(resourceKey).then(() => {
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
    upResourceTaskId,
    upResourceTaskSet,
  ])

  const [upResourceTaskCurrentObjectUrl] = useImageUrl(upResourceTaskCurrent?.ctx.content)
  const [upImageTaskCurrentObjectUrl] = useImageUrl(upImageTaskCurrent?.ctx.file)
  const upResourceTaskCurrentContent = upResourceTaskCurrent?.ctx.content
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
                ...(upResourceTaskCurrent
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
      upResourceTaskCurrent,
      upResourceTaskCurrentContent,
      upResourceTaskCurrentObjectUrl,
    ],
  )
}
