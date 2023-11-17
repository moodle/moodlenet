import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  EditResourceFormRpc,
  EditResourceRespRpc,
  ResourceActions,
  ResourceFormProps,
  ResourceProps,
  SaveState,
  SavingState,
} from '../common/types.mjs'

import { useImageUrl } from '@moodlenet/react-app/ui'
import { createTaskManager, silentCatchAbort } from '@moodlenet/react-app/webapp'
import { useNavigate } from 'react-router-dom'
import { getResourceHomePageRoutePath } from '../common/webapp-routes.mjs'
import { shell } from './shell.mjs'

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
  null | EditResourceRespRpc,
  { file: File | null | undefined }
>()
const [useProvideResourceTasks] = createTaskManager<
  { resourceKey: string } | null,
  { content: string | File }
>()

type myProps = { resourceKey: string }
export const useResourceBaseProps = ({ resourceKey }: myProps) => {
  const nav = useNavigate()
  const [resource, setResource] = useState<ResourceProps | null>()

  const [isToDelete, setIsToDelete] = useState(false)
  const [isPublished, setIsPublish] = useState(false)

  useEffect(() => {
    if (resourceKey === '.') {
      setResource({
        access: { canDelete: false, canEdit: true, canPublish: false, isCreator: true },
        contributor: {} as any,
        data: {} as any,
        resourceForm: {
          learningOutcomes: [],
          description: '',
          title: '',
          language: '',
          level: '',
          license: '',
          month: '',
          year: '',
          subject: '',
          type: '',
        },
        state: { autofillState: undefined, isPublished: false, uploadProgress: undefined },
      })
      return
    }
    setResource(undefined)
    shell.rpc
      .me('webapp/get/:_key')(null, { _key: resourceKey })

      .then(res => {
        res && setIsPublish(res.state.isPublished)
        res &&
          setResource({
            data: res.data,
            access: res.access,
            contributor: res.contributor,
            resourceForm: res.resourceForm,
            state: { ...res.state, uploadProgress: undefined },
          })
      })
      .catch(silentCatchAbort)
  }, [resourceKey])

  const setterSave = useCallback(
    (key: keyof SaveState, val: SavingState) =>
      setSaveState(currentSaved => ({ ...currentSaved, [key]: val })),
    [],
  )

  const [upImageTaskSet, upImageTaskId, upImageTaskCurrent] = useUploadImageTasks(
    resourceKey,
    res => {
      if (res.type === 'resolved' && res.value) {
        const { image /* , ...form  */ } = res.value

        setResource(res => res && { ...res, data: { ...res.data, image } })
      }
      setterSave('image', 'not-saving')
    },
  )
  const [provideResourceTaskSet, provideResourceTaskId, provideResourceTaskCurrent] =
    useProvideResourceTasks(resourceKey, res => {
      if (res.type === 'resolved') {
        // const newContentLocal = res.ctx.content
        // const isFile = !!(newContentLocal instanceof Blob && res.value)
        // updateDataProp('contentType', isFile ? 'file' : 'link')
        // updateDataProp('contentUrl', res.value)
        // updateDataProp('downloadFilename', isFile ? newContentLocal.name : null)
        if (!res.value) {
          return
        }
        const homePath = getResourceHomePageRoutePath({
          _key: res.value.resourceKey,
          title: 'new resource',
        })
        nav(homePath)
      }
      setterSave('content', 'not-saving')
    })

  const [saveState, setSaveState] = useState<SaveState>({
    form: 'not-saving',
    image: upImageTaskCurrent ? 'saving' : 'not-saving',
    content: provideResourceTaskCurrent ? 'saving' : 'not-saving',
  })

  const editData = useCallback(
    async ({ image, meta }: EditResourceFormRpc, rpcId?: string) => {
      setterSave('form', 'saving')
      const editResponse = await shell.rpc.me('webapp/edit/:_key', {
        rpcId,
      })({ form: { meta, image } }, { _key: resourceKey })
      setResource(resource => {
        return (
          resource && {
            ...resource,
            form: editResponse,
          }
        )
      })
      setterSave('form', 'save-done')
      setTimeout(() => setterSave('form', 'not-saving'), 100)
      return editResponse
    },
    [resourceKey, setterSave],
  )
  const actions = useMemo<ResourceActions>(() => {
    const resourceActions: ResourceActions = {
      async editData(res) {
        editData(res, `edit resource ${resourceKey} form`)
      },
      async setImage(image) {
        upImageTaskSet(
          !image
            ? editData({ image: { kind: 'remove' } })
            : editData({ image: { kind: 'file', file: [image] } }, upImageTaskId),
          {
            file: image,
          },
        )
      },

      async provideContent(content: File | string) {
        setterSave('content', 'saving')

        provideResourceTaskSet(
          shell.rpc.me('webapp/create', { rpcId: provideResourceTaskId })({ content: [content] }),
          { content },
        )
        // await setContent(resourceKey, content).then(updateDataProp('contentUrl'))
        // setterSave('content', false)
      },
      publish: () => {
        setIsPublish(true)
        shell.rpc.me('webapp/set-is-published/:_key')({ publish: true }, { _key: resourceKey })
      },
      unpublish: () => {
        setIsPublish(false)
        shell.rpc.me('webapp/set-is-published/:_key')({ publish: false }, { _key: resourceKey })
      },
      deleteResource: () => {
        setIsToDelete(true)
        return shell.rpc
          .me('webapp/trash/:_key')(null, { _key: resourceKey })
          .then(() => {
            setIsToDelete(false)
            nav(-1)
          })
      },
      startAutofill() {
        shell.rpc.me('webapp/:action(cancel|start)/meta-autofill/:_key')(null, {
          _key: resourceKey,
          action: 'start',
        })
        return
      },
      stopAutofill() {
        shell.rpc.me('webapp/:action(cancel|start)/meta-autofill/:_key')(null, {
          _key: resourceKey,
          action: 'cancel',
        })
        return
      },
    }
    return resourceActions
  }, [
    editData,
    resourceKey,
    upImageTaskSet,
    upImageTaskId,
    setterSave,
    provideResourceTaskSet,
    provideResourceTaskId,
    nav,
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
