import { _nullish, d_u, d_u__d, isNotNullish, unreachable_never, url_string } from '@moodle/lib-types'
import { adoptAssetForm, adoptAssetResponse, adoptAssetService, external_content } from '@moodle/module/content'
import { asset, NONE_ASSET } from '@moodle/module/storage'
import { getAssetUrl } from '@moodle/module/storage/lib'
import { DOMAttributes, useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react'
import { humanFileSize } from '../../ui/lib/misc'
import { useAllSchemaConfigs, useFileServerDeployment } from './globalContexts'

//SHAREDLIB: paths and also useFileUploader({type: 'webImage' | 'file'}) that acts as subpath (type) prop
const uploadTempFieldName = 'file'
const uploadTempPath = '/.temp'
const uploadTempMethod = 'POST'
useAssetUploader.type = { webImage: '.jpg,.jpeg,.png,.gif', file: '*' }

type current = d_u<
  {
    asset:
      | { asset: d_u__d<asset, 'type', 'external' | 'local'>; url: string }
      | { asset: d_u__d<asset, 'type', 'none'>; url: _nullish }
    file: { file: File; url: string }
  },
  'type'
>
export type useAssetUploaderHandler = {
  current: current
  openFileDialog: () => void
  submit(): void
  select: (selection: selection | _nullish) => void
  state: assetUploaderState
  dropHandlers: Pick<DOMAttributes<HTMLElement>, 'onDrop' | 'onDragEnter' | 'onDragOver'>
  uploadingXhr?: _nullish | uploadingXhr
  assetType: assetType
}
type uploadingXhr = {
  xhr: XMLHttpRequest
  abort(): void
  file: File
}

export type submissionCallback = (_: { submission: lastSubmission[] }) => void

export type assetUploaderHookOpts<non_nullable extends boolean | undefined> = {
  overrideMaxSize?: number
  nonNullable?: non_nullable
}

type assetType = 'webImage' | 'file'
export function useAssetUploader<non_nullable extends boolean | undefined>(
  assetType: assetType,
  _initialAsset: _nullish | asset,
  adoptAssetService: _nullish | (non_nullable extends true ? adoptAssetService<'upload' | 'external'> : adoptAssetService),
  opts?: assetUploaderHookOpts<non_nullable>,
) {
  const initialAsset = _initialAsset ?? NONE_ASSET
  const { overrideMaxSize } = opts ?? {}
  const filetoreHttp = useFileServerDeployment()
  const { uploadMaxSizeConfigs } = useAllSchemaConfigs()
  const maxSize = overrideMaxSize ?? (assetType === 'webImage' ? uploadMaxSizeConfigs.webImage : uploadMaxSizeConfigs.max)
  const inputFileRef = useRef<HTMLInputElement | null>(null)
  const [state, dispatch] = useReducer(fileUploaderReducer, {
    type: 'settled',
    dirty: false,
    lastSubmission: null,
    selection: null,
    uploadStatus: null,
  } satisfies assetUploaderState)

  const submit = useCallback(() => {
    if (state.type !== 'selected' || !adoptAssetService) {
      return
    }
    if (state.selection.type === 'null' && opts?.nonNullable) {
      return
    }
    const _adoptAssetService = adoptAssetService
    dispatch({ type: 'submit' })
    ;(async (): Promise<adoptAssetForm | 'upload error'> => {
      if (state.selection.type !== 'file') {
        dispatch({ type: 'uploadStatus', status: 'noUpload' })
        return state.selection.type === 'external'
          ? { type: 'external', url: state.selection.url, credits: state.selection.credits }
          : state.selection.type === 'null'
            ? { type: 'none' }
            : unreachable_never(state.selection)
      } else {
        const { file } = state.selection
        const xhr = new XMLHttpRequest()
        const uploadingXhr: uploadingXhr = { file, xhr, abort: xhr.abort.bind(xhr) }
        setUploadingXhr(uploadingXhr)
        return new Promise<{ tempId: string }>((resolve, reject) => {
          const formData = new FormData()
          formData.append(uploadTempFieldName, file)
          // xhr.upload.addEventListener('load', () => resolve(JSON.parse(xhr.responseText)))
          xhr.addEventListener('load', () => resolve(JSON.parse(xhr.responseText)))
          xhr.upload.addEventListener('error', () => reject(xhr.response))
          xhr.upload.addEventListener('progress', progressEvent =>
            dispatch({
              type: 'uploadStatus',
              status: 'uploading',
              progress: progressEvent.lengthComputable ? progressEvent.loaded / progressEvent.total : NaN,
            }),
          )
          xhr.upload.addEventListener('abort', () =>
            dispatch({
              type: 'uploadStatus',
              status: 'aborted',
            }),
          )
          xhr.upload.addEventListener('timeout', () =>
            dispatch({
              type: 'uploadStatus',
              status: 'timeout',
            }),
          )
          xhr.open(uploadTempMethod, `${filetoreHttp.href}${uploadTempPath}/${assetType}`, true)
          //xhr.setRequestHeader("Content-Type", "application/octet-stream");
          xhr.send(formData)
        }).then(
          uploadResponse => {
            const { tempId } = uploadResponse
            dispatch({ type: 'uploadStatus', status: 'done', tempId })
            return { type: 'upload', tempId }
          },
          err => {
            dispatch({ type: 'uploadStatus', status: 'error', message: String(err) })
            return 'upload error'
          },
        )
      }
    })()
      .then(adoptAssetForm => {
        return adoptAssetForm === 'upload error'
          ? Promise.reject('upload error')
          : (_adoptAssetService as adoptAssetService)(adoptAssetForm).catch<adoptAssetResponse>(err => ({
              status: 'error',
              message: String(err),
            }))
      })
      .then(adoptAssetResponse => {
        dispatch({ type: 'actionResponse', ...adoptAssetResponse })
      })
      .finally(() => setUploadingXhr(null))
  }, [state.type, state.selection, adoptAssetService, opts?.nonNullable, filetoreHttp.href, assetType])

  const checkAndSelect = useCallback(
    (selection: selection | _nullish) => {
      if (!adoptAssetService) {
        return
      }
      const maxSizeExceeded = !!selection && selection.type === 'file' && selection.file.size > maxSize
      if (maxSizeExceeded) {
        //TODO: better feedback
        alert(`File size exceeded: max ${humanFileSize(maxSize)}`)
        return
      }
      dispatch({ type: 'select', selection: selection ?? { type: 'null' } })
    },
    [maxSize, adoptAssetService],
  )

  useLayoutEffect(() => {
    const inputElement = document.createElement('input')
    inputElement.type = 'file'
    inputElement.accept = useAssetUploader.type[assetType]
    inputElement.hidden = true
    inputElement.multiple = false
    inputElement.onchange = e => {
      const selectedFile = inputFileRef.current?.files?.item(0)
      if (!selectedFile) {
        return
      }
      if (inputFileRef.current) {
        inputFileRef.current.type = 'text'
        inputFileRef.current.type = 'file'
        inputFileRef.current.value = ''
      }
      checkAndSelect({ type: 'file', file: selectedFile })
    }
    inputFileRef.current = inputElement
    document.body.append(inputElement)
    return () => {
      inputFileRef.current = null
      document.body.removeChild(inputElement)
    }
  }, [assetType, checkAndSelect])

  const openFileDialog = useCallback(() => inputFileRef.current?.click(), [])

  const dropHandlers = useMemo<useAssetUploaderHandler['dropHandlers']>(() => {
    return {
      onDragEnter: onDragOverEnter,
      onDragOver: onDragOverEnter,
      onDrop,
    }
    function onDragOverEnter(e: React.DragEvent<HTMLElement>) {
      e.preventDefault()
    }
    function onDrop(e: React.DragEvent<HTMLElement>) {
      const fileList = (
        e.dataTransfer.items
          ? Array.from(e.dataTransfer.items).map(item => item.getAsFile())
          : Array.from(e.dataTransfer.files)
      ).filter(isNotNullish)
      const [selectedFile] = fileList
      if (!selectedFile) {
        return
      }
      checkAndSelect({ type: 'file', file: selectedFile })
      e.preventDefault()
    }
  }, [checkAndSelect])

  const initializationCurrent = useMemo<current>(
    () =>
      initialAsset.type === 'none'
        ? { type: 'asset', asset: initialAsset, url: null }
        : { type: 'asset', asset: initialAsset, url: getAssetUrl(initialAsset, filetoreHttp.href) },
    [filetoreHttp.href, initialAsset],
  )
  const [activeCurrent, setActiveCurrent] = useState<current>(initializationCurrent)
  useEffect(() => {
    const newActiveCurrent =
      state.type === 'selected'
        ? ((selection): current => {
            if (selection.type === 'file') {
              const url = URL.createObjectURL(selection.file) as url_string
              return { type: 'file', file: selection.file, url }
            }
            return selection.type === 'external'
              ? { type: 'asset', asset: selection, url: selection.url }
              : selection.type === 'null'
                ? { type: 'asset', asset: { type: 'none' }, url: null }
                : unreachable_never(selection)
          })(state.selection)
        : null
    newActiveCurrent && setActiveCurrent(newActiveCurrent)
    return () => {
      newActiveCurrent?.url && URL.revokeObjectURL(newActiveCurrent.url)
    }
  }, [filetoreHttp.href, state])

  const [uploadingXhr, setUploadingXhr] = useState<_nullish | uploadingXhr>()

  return useMemo<useAssetUploaderHandler>(() => {
    const useAssetUploaderHandler: useAssetUploaderHandler = {
      current: activeCurrent,
      openFileDialog,
      submit,
      state,
      dropHandlers,
      select: checkAndSelect,
      uploadingXhr,
      assetType,
    }
    return useAssetUploaderHandler
  }, [activeCurrent, openFileDialog, submit, state, dropHandlers, checkAndSelect, uploadingXhr, assetType])
}

export function fileUploaderReducer(prev: assetUploaderState, action: fileUploaderAction): assetUploaderState {
  if (prev.type === 'submitting') {
    if (action.type === 'actionResponse') {
      if (!(prev.uploadStatus.status === 'done' || prev.uploadStatus.status === 'noUpload')) {
        console.error('prev.uploadStatus.status not done', { action, prev })
        return prev
      }
      return {
        type: 'settled',
        dirty: false,
        lastSubmission: {
          actionResponse: action,
          uploadStatus: prev.uploadStatus,
        },
        selection: null,
        uploadStatus: null,
      }
    } else if (action.type === 'uploadStatus') {
      if (prev.uploadStatus.status !== 'uploading') {
        console.error('prev.uploadStatus not uploading', { action, prev })
        return prev
      }
      if (action.status === 'uploading') {
        const roundedProgress = Number(action.progress.toFixed(2))
        if (roundedProgress === prev.uploadStatus.progress) {
          return prev
        }
        return {
          ...prev,
          uploadStatus: { status: 'uploading', progress: roundedProgress },
        }
      } else if (action.status === 'done') {
        return {
          ...prev,
          uploadStatus: { status: 'done', tempId: action.tempId },
        }
      } else if (action.status === 'noUpload') {
        return {
          ...prev,
          uploadStatus: { status: 'noUpload' },
        }
      } else if (action.status === 'aborted' || action.status === 'timeout' || action.status === 'error') {
        return {
          type: 'selected',
          dirty: true,
          selection: prev.selection,
          lastSubmission: {
            actionResponse: null,
            uploadStatus:
              action.status === 'error'
                ? {
                    status: 'error',
                    message: action.message,
                  }
                : { status: action.status },
          },
          uploadStatus: null,
        }
      } else {
        return unreachable_never(action)
      }
    }
    return prev
  } else if (prev.type === 'selected' && action.type === 'submit') {
    return {
      type: 'submitting',
      dirty: true,
      selection: prev.selection,
      uploadStatus: { status: 'uploading', progress: 0 },
      lastSubmission: prev.lastSubmission,
    }
  } else if (prev.type === 'selected' || prev.type === 'settled') {
    if (action.type === 'select') {
      return {
        type: 'selected',
        dirty: true,
        selection: action.selection,
        lastSubmission: prev.lastSubmission,
        uploadStatus: null,
      }
    }
    return prev
  } else {
    return unreachable_never(prev)
  }
}
// Actions
export type actionResponse = { status: 'waitingForUpload' } | adoptAssetResponse

export type uploadStatus =
  | uploadStatus_error
  | uploadStatus_ok
  | d_u<
      {
        uploading: { progress: number }
      },
      'status'
    >
export type uploadStatus_ok = d_u<
  {
    noUpload: unknown
    done: { tempId: string }
  },
  'status'
>
export type uploadStatus_error = d_u<
  {
    aborted: unknown
    timeout: unknown
    error: { message: string }
  },
  'status'
>

type fileUploaderAction = d_u<
  {
    // reset: { asset?: asset[] }
    select: { selection: selection }
    submit: unknown
    actionResponse: adoptAssetResponse
    uploadStatus: uploadStatus
    abortUpload: { file: File }
  },
  'type'
>

type lastSubmission =
  | {
      uploadStatus: uploadStatus_ok
      actionResponse: actionResponse
    }
  | {
      uploadStatus: uploadStatus_error
      actionResponse: _nullish
    }

// State
export type assetUploaderState = stateSettled | stateSelected | stateSubmitting
type stateSettled = {
  type: 'settled'
  dirty: false
  selection: _nullish
  uploadStatus: _nullish
  lastSubmission: _nullish | lastSubmission
}

type stateSelected = {
  type: 'selected'
  dirty: true
  selection: selection
  uploadStatus: _nullish
  lastSubmission: _nullish | lastSubmission
}
type selection = d_u<{ file: { file: File }; external: external_content; null: unknown }, 'type'>

type stateSubmitting = {
  type: 'submitting'
  dirty: true
  selection: selection
  uploadStatus: uploadStatus
  lastSubmission: _nullish | lastSubmission
}

// old submit logic (replaced by submit callback)

// useEffect(() => {
//   if (state.type !== 'submitting' || !state.selection.file[0]) {
//     return
//   }
//   const uploadPromises = state.selection.file.map(
//     file =>
//       new Promise<{ tempId: string }>(resolve => {
//         const formData = new FormData()
//         formData.append(uploadTempFieldName, file)

//         fetch(`${filetoreHttp.href}${uploadTempPath}/${type}`, {
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
// }, [fileUploadedAction, filetoreHttp.href, state, type])
