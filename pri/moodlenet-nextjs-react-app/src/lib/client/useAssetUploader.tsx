import { _nullish, d_u, isNotNullish } from '@moodle/lib-types'
import { asset } from '@moodle/module/storage'
import { getAssetUrl } from '@moodle/module/storage/lib'
import {
  Dispatch,
  DOMAttributes,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import { humanFileSize } from '../../ui/lib/misc'
import { useAllSchemaConfigs, useFileServerDeployment } from './globalContexts'

//SHAREDLIB: paths and also useFileUploader({type: 'webImage' | 'file'}) that acts as subpath (type) prop
const uploadTempFieldName = 'file'
const uploadTempPath = '/.temp'
const uploadTempMethod = 'POST'
useAssetUploader.type = { webImage: '.jpg,.jpeg,.png,.gif', file: '*' }

export type useAssetUploaderHandler = [
  activeSrcs: string[],
  openFileDialog: () => void,
  submit: () => void,
  state: fileUploaderState,
  dropHandlers: Pick<DOMAttributes<HTMLElement>, 'onDrop' | 'onDragEnter' | 'onDragOver'>,
  dispatch: Dispatch<fileUploaderAction>,
]

export type actionResponse = { done: true; newAssets?: asset[] } | { done: false; error?: string | string[] | _nullish }
export type fileUploadedAction = (_: { tempIds: _nullish | [string, ...string[]] }) => Promise<actionResponse>
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
  const [resetState, setResetState] = useState<fileUploaderState & { type: 'reset' }>({
    type: 'reset',
    dirty: false,
    assets: assets ? [assets].flat() : [],
    selection: null,
    submission: { s: 'never-submitted' },
    error: null,
  })
  const [state, dispatch] = useReducer(getFileUploaderReducer({ maxSize, resetState }), resetState)
  useEffect(() => {
    if (state.type !== 'reset') {
      return
    }
    setResetState(state)
  }, [state])

  useLayoutEffect(() => {
    const inputElement = document.createElement('input')
    inputElement.type = 'file'
    inputElement.accept = useAssetUploader.type[type]
    inputElement.hidden = true
    inputElement.multiple = multiple
    inputElement.onchange = e => {
      const fileList = inputFileRef.current?.files
      if (!fileList?.length) {
        //dispatch({ type: 'reset' })
        return
      }
      const files = fileList.length === 0 ? null : (Array.from(fileList) as [File, ...File[]])
      if (inputFileRef.current) {
        inputFileRef.current.type = 'text'
        inputFileRef.current.type = 'file'
        inputFileRef.current.value = ''
      }
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

  const dropHandlers = useMemo<useAssetUploaderHandler['4']>(() => {
    return {
      onDragEnter: onDragOverEnter,
      onDragOver: onDragOverEnter,
      onDrop,
    }
    function onDragOverEnter(e: React.DragEvent<HTMLElement>) {
      e.preventDefault()
    }
    function onDrop(e: React.DragEvent<HTMLElement>) {
      console.log({ e, i: e.dataTransfer.items.length, f: e.dataTransfer.files.length })
      const fileList = e.dataTransfer.items
        ? Array.from(e.dataTransfer.items)
            .map(item => item.getAsFile())
            .filter(isNotNullish)
        : Array.from(e.dataTransfer.files)

      if (fileList.length === 0) {
        return
      }
      const files = fileList.length === 0 ? null : (Array.from(fileList) as [File, ...File[]])

      dispatch({ type: 'select', files })
      e.preventDefault()
    }
  }, [])

  const [activeSrcs, setActiveSrcs] = useState<string[]>([])
  useEffect(() => {
    const newActiveSrcs =
      state.type === 'reset'
        ? state.submission.storedAssets
          ? optimisticAssetUrlUpdate
            ? state.submission.storedAssets.map(asset => getAssetUrl(asset, filestoreHttp.href))
            : null
          : state.assets.map(asset => getAssetUrl(asset, filestoreHttp.href))
        : state.type === 'selected'
          ? state.selection
            ? state.selection.files.map(file => URL.createObjectURL(file))
            : []
          : state.type === 'submitting'
            ? null
            : null
    newActiveSrcs && setActiveSrcs(newActiveSrcs)
    return () => {
      newActiveSrcs?.forEach(URL.revokeObjectURL)
    }
  }, [filestoreHttp.href, state, optimisticAssetUrlUpdate])

  const submit = useCallback(() => {
    if (state.type !== 'selected' || state.error) {
      return
    }
    dispatch({ type: 'submit' })
    const m_uploadPromise = state.selection
      ? Promise.all(
          state.selection.files.map(
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
          ),
        )
      : Promise.resolve(null)

    m_uploadPromise
      .then<actionResponse, actionResponse>(
        m_uploadResponses => {
          return action({ tempIds: m_uploadResponses && (m_uploadResponses.map(r => r.tempId) as [string, ...string[]]) })
        },
        err => ({ done: false, error: String(err) }),
      )
      .then(actionResponse => {
        console.dir({ actionResponse })
        dispatch({ type: 'actionResponse', response: actionResponse })
      })
  }, [state, filestoreHttp.href, action, type])

  return useMemo<useAssetUploaderHandler>(() => {
    return [activeSrcs, openFileDialog, submit, state, dropHandlers, dispatch]
  }, [activeSrcs, openFileDialog, state, submit, dropHandlers])
}
function getFileUploaderReducer({
  maxSize,
  resetState,
}: {
  maxSize: number
  resetState: fileUploaderState & { type: 'reset' }
}) {
  return function fileUploaderReducer(prev: fileUploaderState, action: fileUploaderAction): fileUploaderState {
    console.log({ prev, action, resetState })
    if (prev.type === 'submitting') {
      if (action.type === 'actionResponse') {
        return action.response.done
          ? {
              type: 'reset',
              dirty: false,
              assets: action.response.newAssets ?? prev.assets,
              selection: null,
              submission: {
                s: 'last-submitted',
                selection: prev.selection,
                storedAssets: action.response.newAssets ?? [],
              },
              error: null,
            }
          : {
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
        type: 'reset',
        dirty: false,
        assets: action.assets ?? prev.assets,
        selection: null,
        error: null,
        submission: { s: 'never-submitted' },
      }
    } else if (action.type === 'select') {
      const maxSizeExceeded = !!action.files && action.files.some(file => file.size > maxSize)
      return maxSizeExceeded
        ? { ...prev, error: `File size exceeds the limit of ${humanFileSize(maxSize)}` }
        : /* !action.files &&
            (resetState.submission.s === 'last-submitted'
              ? !resetState.submission.selection?.files.length
              : !resetState.assets.length)
          ? resetState
          : */ {
            type: 'selected',
            dirty: true,
            selection: action.files && { files: action.files },
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
    select: { files: _nullish | [File, ...File[]] }
    submit: unknown
    actionResponse: { response: actionResponse }
  },
  'type'
>
type selection = _nullish | { files: [File, ...File[]] }

// State
export type fileUploaderState = { assets: asset[]; submission: submissionStatus; error: _nullish | string } & (
  | stateReset
  | stateSelected
  | stateSubmitting
)
type submissionStatus = lastSubmission | neverSubmitted
type lastSubmission = { s: 'last-submitted'; selection: selection; storedAssets: asset[] }
type neverSubmitted = { s: 'never-submitted'; selection?: _nullish; storedAssets?: _nullish }
type stateReset = {
  type: 'reset'
  dirty: false
  selection: selection
}

type stateSelected = {
  type: 'selected'
  dirty: true
  selection: selection
}

type stateSubmitting = {
  type: 'submitting'
  dirty: true
  selection: selection
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
