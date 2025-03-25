import { d_u, d_u__d, isNotNullish, nullish, unreachable_never, url_string } from '@moodle/lib-types'
import { adoptAssetForm, adoptAssetResult, asset, externalAsset, maybeAsset, NONE_ASSET } from '@moodle/module/storage'
import { getAssetUrl } from '@moodle/module/storage/lib'
import { DeploymentInfo } from 'domain/src/modules/env'
import { DOMAttributes, useCallback, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react'
import { humanFileSize } from '../../ui/lib/misc'
import { adoptAssetSafeAction, adoptValuedAssetSafeAction } from '../common/actions'
import { useGlobalCtx } from './globalContexts'

//SHAREDLIB: paths and also useFileUploader({type: 'webImage' | 'file'}) that acts as subpath (type) prop
const uploadTempFieldName = 'file'
const uploadTempPath = '/.temp'
const uploadTempMethod = 'POST'
useAssetUploader.type = { webImage: '.jpg,.jpeg,.png,.gif', file: '*' }

type selectedCurrentAsset =
  | {
      asset: d_u__d<maybeAsset, 'type', 'external'>
      url: string
    }
  | {
      asset: d_u__d<maybeAsset, 'type', 'none'>
      url: nullish
    }
  | {
      asset: { type: 'file'; file: File }
      url: string
    }

type settledCurrentAsset =
  | {
      asset: asset
      url: string
    }
  | {
      asset: d_u__d<maybeAsset, 'type', 'none'>
      url: nullish
    }

type current = d_u<
  {
    settled: settledCurrentAsset

    selected: selectedCurrentAsset
  },
  'type'
>
export type useAssetUploaderHandler = {
  current: current
  openFileDialog: () => void
  submit(): void
  select: (selection: selection | nullish) => void
  state: assetUploaderState
  dropHandlers: Pick<DOMAttributes<HTMLElement>, 'onDrop' | 'onDragEnter' | 'onDragOver'>
  uploadingHandler?: nullish | uploadingHandler
  assetType: assetType
}
type uploadingHandler = {
  //xhr: XMLHttpRequest
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
  initialAsset: nullish | maybeAsset,
  //FIXME: !! adoptAssetService !! NOT adoptValuedAssetSafeAction
  adoptAssetService: nullish | (non_nullable extends true ? adoptValuedAssetSafeAction : adoptAssetSafeAction),
  opts?: assetUploaderHookOpts<non_nullable>,
) {
  const { overrideMaxSize, nonNullable } = opts ?? {}
  const filetoreHttp = useGlobalCtx().filestoreHttpDeployment
  const { uploadMaxSizeConfigs } = useGlobalCtx().allSchemaConfigs
  const maxSize = overrideMaxSize ?? (assetType === 'webImage' ? uploadMaxSizeConfigs.webImage : uploadMaxSizeConfigs.max)
  const inputFileRef = useRef<HTMLInputElement | null>(null)
  const [state, dispatch] = useReducer(fileUploaderReducer, {
    type: 'settled',
    lastSettledAsset: initialAsset ?? NONE_ASSET,
    dirty: false,
    lastSubmission: null,
    selection: null,
    uploadStatus: null,
  } satisfies assetUploaderState)
  const submit = useCallback(() => {
    if (state.type !== 'selected' || !adoptAssetService) {
      return
    }
    if (state.selection.type === 'null' && nonNullable) {
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
        const uploadingHandler: uploadingHandler = {
          file,
          abort() {
            xhr.abort()
          } /* , xhr */,
        }
        setUploadingHandler(uploadingHandler)
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
            return { type: 'tempFile', tempId }
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
          : (_adoptAssetService as adoptAssetSafeAction)(adoptAssetForm).then<adoptAssetResult, adoptAssetResult>(
              response =>
                response?.data
                  ? response.data
                  : response?.bindArgsValidationErrors || response?.serverError || response?.validationErrors
                    ? { status: 'error', message: JSON.stringify(response) }
                    : { status: 'assetSubmitted' },
              err => ({
                status: 'error',
                message: String(err),
              }),
            )
      })
      .then(actionResponse => {
        dispatch({ type: 'actionResponse', ...actionResponse })
      })
      .finally(() => setUploadingHandler(null))
  }, [state.type, state.selection, adoptAssetService, nonNullable, filetoreHttp.href, assetType])

  const checkAndSelect = useCallback(
    (m_selection: selection | nullish) => {
      if (!adoptAssetService) {
        return null
      }
      const maxSizeExceeded = !!m_selection && m_selection.type === 'file' && m_selection.file.size > maxSize
      if (maxSizeExceeded) {
        //TODO: better feedback
        alert(`File size exceeded: max ${humanFileSize(maxSize)}`)
        return null
      }
      const selection = m_selection ?? { type: 'null' }
      dispatch({ type: 'select', selection })
    },
    [maxSize, adoptAssetService],
  )

  useLayoutEffect(() => {
    const inputElement = document.createElement('input')
    inputElement.type = 'file'
    inputElement.accept = useAssetUploader.type[assetType]
    inputElement.hidden = true
    inputElement.multiple = false
    inputElement.onchange = () => {
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

  const openFileDialog = useCallback(() => {
    if (state.type === 'submitting') {
      return
    }
    inputFileRef.current?.click()
  }, [state.type])

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

  const [current, setCurrent] = useState<current>(currentFromLastSettledAsset(state.lastSettledAsset, filetoreHttp))

  const newCurrent: current = state.selection
    ? selectionToCurrent(state.selection)
    : currentFromLastSettledAsset(state.lastSettledAsset, filetoreHttp)

  const currentChanged = !currentEquals(newCurrent, current)

  if (currentChanged) {
    current.url && URL.revokeObjectURL(current.url)
    setCurrent(newCurrent)
  }

  const [uploadingHandler, setUploadingHandler] = useState<nullish | uploadingHandler>()

  const assetUploaderHandler = useMemo<useAssetUploaderHandler>(() => {
    const useAssetUploaderHandler: useAssetUploaderHandler = {
      current,
      openFileDialog,
      submit,
      state,
      dropHandlers,
      select: checkAndSelect,
      uploadingHandler,
      assetType,
    }
    return useAssetUploaderHandler
  }, [current, openFileDialog, submit, state, dropHandlers, checkAndSelect, uploadingHandler, assetType])
  return assetUploaderHandler
}
function selectionToCurrent(selection: selection): current {
  if (selection.type === 'file') {
    const url = URL.createObjectURL(selection.file) as url_string
    return { type: 'selected', asset: { type: 'file', file: selection.file }, url }
  }
  return selection.type === 'external'
    ? { type: 'selected', asset: selection, url: selection.url }
    : selection.type === 'null'
      ? { type: 'selected', asset: { type: 'none' }, url: null }
      : unreachable_never(selection)
}

function currentFromLastSettledAsset(lastSettledAsset: lastSettledAsset, filetoreHttp: DeploymentInfo): current {
  return lastSettledAsset.type === 'none'
    ? {
        type: 'settled',
        asset: lastSettledAsset,
        url: null,
      }
    : lastSettledAsset.type === 'assetSubmitted'
      ? selectionToCurrent(lastSettledAsset.selection)
      : lastSettledAsset.type === 'external' || lastSettledAsset.type === 'stored'
        ? {
            type: 'settled',
            asset: lastSettledAsset,
            url: getAssetUrl(lastSettledAsset, filetoreHttp.href),
          }
        : unreachable_never(lastSettledAsset)
}
function currentEquals(newCurr: current, prevCurr: current) {
  if (newCurr.asset.type === 'none' && prevCurr.asset.type === 'none') {
    return true
  }
  if (newCurr.asset.type === 'file' && prevCurr.asset.type === 'file') {
    return newCurr.asset.file === prevCurr.asset.file
  }
  if (newCurr.asset.type === 'external' && prevCurr.asset.type === 'external') {
    return newCurr.asset.url === prevCurr.asset.url
  }
  if (newCurr.asset.type === 'stored' && prevCurr.asset.type === 'stored') {
    return newCurr.asset.path === prevCurr.asset.path
  }
  return false
}

export function fileUploaderReducer(prev: assetUploaderState, action: fileUploaderAction): assetUploaderState {
  if (prev.type === 'submitting') {
    if (action.type === 'actionResponse') {
      if (!(prev.uploadStatus.status === 'done' || prev.uploadStatus.status === 'noUpload')) {
        console.error('prev.uploadStatus.status not done', { action, prev })
        return prev
      }
      if (action.status === 'done' || action.status === 'assetSubmitted') {
        const lastSettledAsset: lastSettledAsset =
          action.status === 'assetSubmitted'
            ? prev.selection.type === 'null'
              ? { type: 'none' }
              : { type: 'assetSubmitted', selection: prev.selection }
            : action.status === 'done'
              ? action.asset
              : unreachable_never(action)

        return {
          type: 'settled',
          dirty: false,
          lastSettledAsset,
          lastSubmission: {
            uploadStatus: prev.uploadStatus,
            actionResponse: action,
          },
          selection: null,
          uploadStatus: null,
        }
      } else if (action.status === 'error') {
        return {
          type: 'selected',
          dirty: true,
          lastSettledAsset: prev.lastSettledAsset,
          lastSubmission: {
            uploadStatus: { status: 'error', message: action.message },
          },
          selection: prev.selection,
          uploadStatus: null,
        }
      } else {
        unreachable_never(action)
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
        return action.status === 'aborted'
          ? {
              type: 'settled',
              dirty: false,
              lastSettledAsset: prev.lastSettledAsset,
              lastSubmission: prev.lastSubmission,
              selection: null,
              uploadStatus: null,
            }
          : {
              type: 'selected',
              dirty: true,
              selection: prev.selection,
              lastSettledAsset: prev.lastSettledAsset,
              lastSubmission: {
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
      lastSettledAsset: prev.lastSettledAsset,
      selection: prev.selection,
      uploadStatus: { status: 'uploading', progress: 0 },
      lastSubmission: prev.lastSubmission,
    }
  } else if (prev.type === 'selected' || prev.type === 'settled') {
    if (action.type === 'select') {
      return selectionEqualsLastSettledAsset(action.selection, prev.lastSettledAsset)
        ? {
            type: 'settled',
            dirty: false,
            lastSettledAsset: prev.lastSettledAsset,
            selection: null,
            lastSubmission: prev.lastSubmission,
            uploadStatus: null,
          }
        : {
            type: 'selected',
            dirty: true,
            lastSettledAsset: prev.lastSettledAsset,
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
function selectionEqualsLastSettledAsset(selection: selection, lastSettledAsset: lastSettledAsset) {
  const areBothNone = selection.type === 'null' && lastSettledAsset.type === 'none'
  const areSameExternal =
    selection.type === 'external' && lastSettledAsset.type === 'external' && selection.url === lastSettledAsset.url
  return areBothNone || areSameExternal
}
// Actions
// export type actionResponse = d_u<
//   { done: { adoptAssetResult?: adoptAssetResult | nullish }; error: { message: string } },
//   'status'
// >

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
    error: { message: string | undefined }
  },
  'status'
>

type fileUploaderAction = d_u<
  {
    // reset: { asset?: asset[] }
    select: { selection: selection }
    submit: unknown
    actionResponse: adoptAssetResult
    uploadStatus: uploadStatus
    // abortUpload: unknown
  },
  'type'
>

type lastSubmission =
  | {
      uploadStatus: uploadStatus_ok
      actionResponse: adoptAssetResult
    }
  | {
      uploadStatus: uploadStatus_error
    }

// State
export type assetUploaderState = stateSettled | stateSelected | stateSubmitting
type lastSettledAsset =
  | maybeAsset
  | {
      type: 'assetSubmitted'
      selection: selection
    }

type stateSettled = {
  type: 'settled'
  dirty: false
  lastSettledAsset: lastSettledAsset
  selection: nullish
  uploadStatus: nullish
  lastSubmission: nullish | lastSubmission
}

type stateSelected = {
  type: 'selected'
  dirty: true
  lastSettledAsset: lastSettledAsset
  selection: selection
  uploadStatus: nullish
  lastSubmission: nullish | lastSubmission
}
type selection = d_u<{ file: { file: File }; external: externalAsset; null: unknown }, 'type'>

type stateSubmitting = {
  type: 'submitting'
  dirty: true
  lastSettledAsset: lastSettledAsset
  selection: selection
  uploadStatus: uploadStatus
  lastSubmission: nullish | lastSubmission
}
