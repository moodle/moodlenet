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
  const loadData = useCallback(() => {
    shell.rpc
      .me('webapp/get/:_key')(null, { _key: resourceKey })

      .then(res => {
        if (!res) {
          return
        }
        // res.state.value === 'Autogenerating-Meta' && schedulePolling()
        setIsPublish(res.state.isPublished)

        setResource({
          // data: { ...res.data, image: res.state.autofillSuggestions?.image ?? res.data.image },
          data: res.data,
          access: res.access,
          contributor: res.contributor,
          resourceForm: { ...res.resourceForm, ...res.state.autofillSuggestions?.meta },
          state: {
            ...res.state,
            uploadProgress: undefined,
            autofillState:
              res.state.value === 'Autogenerating-Meta'
                ? 'ai-generation'
                : res.state.value === 'Meta-Suggestion-Available'
                ? 'ai-completed'
                : undefined,
          },
        })
      })
      .catch(silentCatchAbort)
  }, [resourceKey])

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
    loadData()
  }, [resourceKey, loadData])
  useEffect(() => {
    if (resource?.state.autofillState === 'ai-generation') {
      setTimeout(loadData, 10000)
    }
  }, [loadData, resource])
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
      if (resource?.state.autofillState === 'ai-completed') {
        setResource(res => res && { ...res, state: { ...res.state, autofillState: undefined } })
      }
      setterSave('form', 'save-done')
      setTimeout(() => setterSave('form', 'not-saving'), 100)
      return editResponse
    },
    [resource?.state.autofillState, resourceKey, setterSave],
  )
  const actions = useMemo<ResourceActions>(() => {
    const resourceActions: ResourceActions = {
      cancelUpload() {
        shell.abortRpc(provideResourceTaskId)
      },
      async editData(res) {
        editData({ meta: res }, `edit resource ${resourceKey} form`)
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
      publish: async () => {
        const { done } = await shell.rpc.me('webapp/set-is-published/:_key')(
          { publish: true },
          { _key: resourceKey },
        )
        done && setIsPublish(true)
      },
      unpublish: async () => {
        const { done } = await shell.rpc.me('webapp/set-is-published/:_key')(
          { publish: false },
          { _key: resourceKey },
        )
        done && setIsPublish(false)
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
      async startAutofill() {
        const { done } = await shell.rpc.me('webapp/:action(cancel|start)/meta-autofill/:_key')(
          null,
          {
            _key: resourceKey,
            action: 'start',
          },
        )
        done && loadData()
        return
      },
      async stopAutofill() {
        const { done } = await shell.rpc.me('webapp/:action(cancel|start)/meta-autofill/:_key')(
          null,
          {
            _key: resourceKey,
            action: 'cancel',
          },
        )
        done && loadData()
        return
      },
    }
    return resourceActions
  }, [
    loadData,
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
              state: {
                ...resource.state,
                isPublished,
                uploadProgress: saveState.content === 'saving' ? 'N/A' : undefined,
              },
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
