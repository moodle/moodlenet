import { _nullish } from '@moodle/lib-types'
import { asset, getAssetUrl } from '@moodle/module/storage'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAllSchemaConfigs, useAsset, useDeployments } from './globalContexts'

//SHAREDLIB: paths and also useFileUploader({type}) that acts as subpath (type) prop
const uploadTempFieldName = 'file'
const uploadTempPath = '/.temp'
const uploadTempMethod = 'POST'
useFileUploader.type = { webImage: '.jpg,.jpeg,.png,.gif', file: '*' }

export type fileUploadedAction = (_: {
  tempId: string
}) => Promise<{ done: true; newAsset?: asset } | { done: false; error?: string | string[] | _nullish }>
export function useFileUploader({
  asset,
  fileUploadedAction,
  type,
  overrideMaxSize,
}: {
  asset: asset
  fileUploadedAction: fileUploadedAction
  type: 'webImage' | 'file'
  overrideMaxSize?: number
}) {
  const { filestoreHttp } = useDeployments()
  const { uploadMaxSizeConfigs } = useAllSchemaConfigs()
  const maxSize = overrideMaxSize ?? (type === 'webImage' ? uploadMaxSizeConfigs.webImage : uploadMaxSizeConfigs.max)
  const inputRef = useRef<HTMLInputElement | null>(null)
  // TODO: this complex state management definitely deserves a useReducer ;)
  // NOTE: that would remove all (or most of) the useEffects !
  // NOTE: and make the whole logic simple and understandable
  const [currentAsset, setCurrentAsset] = useState(asset)
  const [currentAssetUrl] = useAsset(currentAsset)

  // const [latestUpdatedSrc, setLatestUpdatedSrc] = useState(getAssetUrl(asset, filestoreHttp.href))
  const [localSrc, setLocalSrc] = useState(currentAssetUrl)
  const [error, setError] = useState('')
  const [choosenFile, setChoosenFile] = useState<{ file: File; url: string } | null>(null)
  useEffect(() => {
    setLocalSrc(currentAssetUrl)
    inputRef.current && (inputRef.current.value = '')
  }, [currentAssetUrl, filestoreHttp.href])
  useEffect(() => {
    // align localSrc when user has choosen a valid file (choosenFile)
    if (!choosenFile) {
      inputRef.current && (inputRef.current.value = '')
      return
    }
    setLocalSrc(choosenFile.url)
    return () => {
      URL.revokeObjectURL(choosenFile.url)
    }
  }, [choosenFile])
  useEffect(() => {
    // create input element for file upload
    // append it to the body
    // update it when configs changes ( accept, maxSize )
    const inputElement = document.createElement('input')
    inputElement.type = 'file'
    inputElement.accept = useFileUploader.type[type]
    inputElement.hidden = true
    inputElement.multiple = false
    inputElement.onchange = e => {
      const inputEl = inputRef.current
      const file = inputEl?.files?.[0]
      if (file) {
        if (file.size > maxSize) {
          setError('File size exceeds the limit')
          setChoosenFile(null)
          return
        }
        setError('')
        const url = URL.createObjectURL(file)
        setChoosenFile({ file, url })
      } else {
        setChoosenFile(null)
      }
    }
    inputRef.current = inputElement
    document.body.append(inputElement)
    return () => {
      // remove it from the body
      inputRef.current = null
      document.body.removeChild(inputElement)
    }
  }, [type, maxSize])
  const openFileDialog = useCallback(() => {
    inputRef.current?.click()
  }, [])
  const dirty = !!choosenFile
  const submit = useCallback(() => {
    if (!dirty) return
    const formData = new FormData()
    formData.append(uploadTempFieldName, choosenFile.file)

    fetch(`${filestoreHttp.href}${uploadTempPath}/${type}`, {
      body: formData,
      method: uploadTempMethod,
    })
      .then(r => r.json())
      .then(fileUploadedAction)
      .then(result => {
        if (!result.done) {
          setError([result.error ?? 'Unknown error'].flat().join('\n'))
          return
        }
        inputRef.current && (inputRef.current.value = '')
        if (result.newAsset) {
          setCurrentAsset(result.newAsset)
          setChoosenFile(null)
        }
      })
  }, [dirty, choosenFile?.file, filestoreHttp.href, type, fileUploadedAction])
  return [localSrc, openFileDialog, submit, error, currentAsset, dirty] as const
}
