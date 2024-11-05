import { _nullish, d_u, isNotNullish } from '@moodle/lib-types'
import { asset } from '@moodle/module/storage'
import { getAssetUrl } from '@moodle/module/storage/lib'
import { DOMAttributes, useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react'
import { humanFileSize } from '../../ui/lib/misc'
import { useAllSchemaConfigs, useFileServerDeployment } from './globalContexts'

//SHAREDLIB: paths and also useFileUploader({type: 'webImage' | 'file'}) that acts as subpath (type) prop
const uploadTempFieldName = 'file'
const uploadTempPath = '/.temp'
const uploadTempMethod = 'POST'
useAssetUploader.type = { webImage: '.jpg,.jpeg,.png,.gif', file: '*' }

type handler = [
  activeSrcs: string[],
  openFileDialog: () => void,
  submit: () => void,
  state: fileUploaderState,
  dropHandlers: Pick<DOMAttributes<HTMLElement>, 'onDrop' | 'onDragEnter' | 'onDragOver'>,
]

export type actionResponse = { done: true; newAssets?: asset[] } | { done: false; error?: string | string[] | _nullish }
export type fileUploadedAction = (_: { tempIds: [string, ...string[]] }) => Promise<actionResponse>
export type assetUploaderHookProps = {
  assets: _nullish | asset | asset[]
  action: fileUploadedAction
  type: 'webImage' | 'file'
  multiple?: boolean
  optimisticAssetUrlUpdate?: boolean
  overrideMaxSize?: number
}

export function useAssetUploader({
  assets,
  action,
  type,
  multiple = false,
  optimisticAssetUrlUpdate = false,
  overrideMaxSize,
}: assetUploaderHookProps) {
  const filestoreHttp = useFileServerDeployment()
  const { uploadMaxSizeConfigs } = useAllSchemaConfigs()
  const maxSize = overrideMaxSize ?? (type === 'webImage' ? uploadMaxSizeConfigs.webImage : uploadMaxSizeConfigs.max)
  const inputFileRef = useRef<HTMLInputElement | null>(null)
  const [state, dispatch] = useReducer(getFileUploaderReducer({ maxSize }), {
    type: 'idle',
    dirty: false,
    assets: assets ? [assets].flat() : [],
    selection: null,
    submission: { s: 'never-submitted' },
    error: null,
  } satisfies fileUploaderState)

  useLayoutEffect(() => {
    const inputElement = document.createElement('input')
    inputElement.type = 'file'
    inputElement.accept = useAssetUploader.type[type]
    inputElement.hidden = true
    inputElement.multiple = multiple
    inputElement.onchange = e => {
      const fileList = inputFileRef.current?.files
      if (!fileList?.length) {
        dispatch({ type: 'reset' })
        return
      }
      const files = Array.from(fileList) as [File, ...File[]]
      dispatch({ type: 'select', files })
    }
    inputFileRef.current = inputElement
    document.body.append(inputElement)
    return () => {
      inputFileRef.current = null
      document.body.removeChild(inputElement)
    }
  }, [type, maxSize, multiple])

  const openFileDialog = useCallback(() => inputFileRef.current?.click(), [])

  const dropHandlers = useMemo<handler['4']>(() => {
    return {
      onDragEnter: onDragOverEnter,
      onDragOver: onDragOverEnter,
      onDrop,
    }
    function onDragOverEnter(e: React.DragEvent<HTMLElement>) {
      e.preventDefault()
    }
    function onDrop(e: React.DragEvent<HTMLElement>) {
      e.preventDefault()

      const fileList = e.dataTransfer.items
        ? Array.from(e.dataTransfer.items)
            .map(item => item.getAsFile())
            .filter(isNotNullish)
        : Array.from(e.dataTransfer.files)

      if (fileList.length === 0) {
        dispatch({ type: 'reset' })
        return
      }
      const files = Array.from(fileList) as [File, ...File[]]
      dispatch({ type: 'select', files })
    }
  }, [])

  const [activeSrcs, setActiveSrcs] = useState<string[]>([])
  useEffect(() => {
    const newActiveSrcs =
      state.type === 'idle'
        ? state.submission.storedAssets
          ? optimisticAssetUrlUpdate
            ? state.submission.storedAssets.map(asset => getAssetUrl(asset, filestoreHttp.href))
            : null
          : state.assets.map(asset => getAssetUrl(asset, filestoreHttp.href))
        : state.type === 'selected'
          ? state.selection.files.map(file => URL.createObjectURL(file))
          : state.type === 'submitting'
            ? null
            : null
    setActiveSrcs(currActiveSrcs => newActiveSrcs ?? currActiveSrcs)
    return () => {
      newActiveSrcs?.forEach(URL.revokeObjectURL)
    }
  }, [filestoreHttp.href, state, optimisticAssetUrlUpdate])

  const submit = useCallback(() => {
    if (state.type !== 'selected' || state.error) {
      return
    }
    dispatch({ type: 'submit' })
    const uploadPromises = state.selection.files.map(
      file =>
        new Promise<{ tempId: string }>(resolve => {
          const formData = new FormData()
          formData.append(uploadTempFieldName, file)

          fetch(`${filestoreHttp.href}${uploadTempPath}/${type}`, {
            body: formData,
            method: uploadTempMethod,
          })
            .then(r => r.json())
            .then(resolve)
        }),
    )
    Promise.all(uploadPromises)
      .then<actionResponse, actionResponse>(
        uploadResponses => action({ tempIds: uploadResponses.map(r => r.tempId) as [string, ...string[]] }),
        err => ({ done: false, error: String(err) }),
      )
      .then(actionResponse => {
        dispatch({ type: 'actionResponse', response: actionResponse })
      })
  }, [state, filestoreHttp.href, action, type])

  return useMemo<handler>(() => {
    return [activeSrcs, openFileDialog, submit, state, dropHandlers]
  }, [activeSrcs, openFileDialog, state, submit, dropHandlers])
}
function getFileUploaderReducer({ maxSize }: { maxSize: number }) {
  return function fileUploaderReducer(prev: fileUploaderState, action: fileUploaderAction): fileUploaderState {
    if (prev.type === 'submitting') {
      if (action.type === 'actionResponse') {
        if (action.response.done) {
          return {
            type: 'idle',
            dirty: false,
            assets: action.response.newAssets ?? prev.assets,
            selection: null,
            submission: {
              s: 'last-submitted',
              files: prev.selection.files,
              storedAssets: action.response.newAssets ?? [],
            },
            error: null,
          }
        }
        return {
          type: 'selected',
          submission: prev.submission,
          error: [action.response?.error ?? 'unknown error while submitting'].flat().join('\n'),
          assets: prev.assets,
          dirty: true,
          selection: prev.selection,
        }
      }
      // if (action.type === 'abort') {
      //    eventually add this action : 'abort during submitting'
      // }
    } else if (prev.type === 'selected') {
      if (action.type === 'submit') {
        return {
          type: 'submitting',
          submission: prev.submission,
          error: null,
          assets: prev.assets,
          dirty: true,
          selection: prev.selection,
        }
      }
    }

    if (action.type === 'reset') {
      return {
        type: 'idle',
        dirty: false,
        assets: action.assets ?? prev.assets,
        selection: null,
        error: null,
        submission: { s: 'never-submitted' },
      }
    } else if (action.type === 'select') {
      const maxSizeExceeded = action.files.some(file => file.size > maxSize)
      return maxSizeExceeded
        ? { ...prev, error: `File size exceeds the limit of ${humanFileSize(maxSize)}` }
        : {
            type: 'selected',
            dirty: true,
            selection: { files: action.files },
            error: null,
            assets: prev.assets,
            submission: prev.submission,
          }
    }

    return prev
  }
}
// Actions
type fileUploaderAction = d_u<
  {
    reset: { assets?: asset[] }
    select: { files: [File, ...File[]] }
    submit: unknown
    actionResponse: { response: actionResponse }
  },
  'type'
>

// State
export type fileUploaderState = { assets: asset[]; submission: submissionStatus; error: _nullish | string } & (
  | stateIdle
  | stateSelected
  | stateSubmitting
)
type submissionStatus = lastSubmission | neverSubmitted
type lastSubmission = { s: 'last-submitted'; files: File[]; storedAssets: asset[] }
type neverSubmitted = { s: 'never-submitted'; files?: _nullish; storedAssets?: _nullish }
type stateIdle = {
  type: 'idle'
  dirty: false
  selection: _nullish | { files: [] }
}

type stateSelected = {
  type: 'selected'
  dirty: true
  selection: { files: [File, ...File[]] }
}

type stateSubmitting = {
  type: 'submitting'
  dirty: true
  selection: { files: [File, ...File[]] }
}

// old submit logic (replaced by submit callback)

// useEffect(() => {
//   if (state.type !== 'submitting' || !state.selection.files[0]) {
//     return
//   }
//   const uploadPromises = state.selection.files.map(
//     file =>
//       new Promise<{ tempId: string }>(resolve => {
//         const formData = new FormData()
//         formData.append(uploadTempFieldName, file)

//         fetch(`${filestoreHttp.href}${uploadTempPath}/${type}`, {
//           body: formData,
//           method: uploadTempMethod,
//         })
//           .then(r => r.json())
//           .then(resolve)
//       }),
//   )
//   Promise.all(uploadPromises)
//     .then<actionResponse, actionResponse>(
//       uploadResponses => fileUploadedAction({ tempIds: uploadResponses.map(r => r.tempId) as [string, ...string[]] }),
//       err => ({ done: false, error: String(err) }),
//     )
//     .then(actionResponse => {
//       dispatch({ type: 'actionResponse', response: actionResponse })
//     })
// }, [fileUploadedAction, filestoreHttp.href, state, type])
