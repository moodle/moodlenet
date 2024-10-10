import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { GlobalCtx } from '../../app/root-layout.client'
import { _nullish, d_u, map, ok_ko } from '@moodle/lib-types'

//SHAREDLIB
const uploadTempFieldName = 'file'
const uploadTempPath = '/.temp'
const uploadTempMethod = 'POST'

export type fileUploadedAction = (_: {
  tempId: string
}) => Promise<
  { done: true; newCurrent?: string } | { done: false; error?: string | string[] | _nullish }
>
useFileUploader.type = { image: '.jpg,.jpeg,.png,.gif', any: '*' }
export function useFileUploader<actionMeta extends map<string> = never>({
  currentSrc,
  fileUploadedAction,
  accept = useFileUploader.type.any,
  maxSize = 16777216, //16MB Math.pow(2,24)
}: {
  currentSrc: string
  fileUploadedAction: fileUploadedAction
  maxSize?: number
  accept?: string
  withMeta: actionMeta extends never ? never : () => actionMeta
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  // TODO: this complex state management definitely deserves a useReducer ;)
  // NOTE: that would remove all (or most of) the useEffects !
  // NOTE: and make the whole logic simple and understandable
  const [currentSrcCache, setCurrentSrcCache] = useState(currentSrc)
  const [latestUpdatedSrc, setLatestUpdatedSrc] = useState(currentSrc)
  const [localSrc, setLocalSrc] = useState(currentSrc)
  const [error, setError] = useState('')
  const [choosenFile, setChoosenFile] = useState<{ file: File; url: string } | null>(null)
  useEffect(() => {
    // align all srcs to the currentSrc when it changes
    setCurrentSrcCache(currentSrc)
    setLatestUpdatedSrc(currentSrc)
    setLocalSrc(currentSrc)
    inputRef.current && (inputRef.current.value = '')
  }, [currentSrc])
  useEffect(() => {
    // align localSrc when user has choosen a valid file (choosenFile)
    if (!choosenFile) {
      setLocalSrc(latestUpdatedSrc)
      inputRef.current && (inputRef.current.value = '')
      return
    }
    setLocalSrc(choosenFile.url)
    return () => {
      URL.revokeObjectURL(choosenFile.url)
    }
  }, [choosenFile, currentSrcCache, latestUpdatedSrc])
  useEffect(() => {
    // create input element for file upload
    // append it to the body
    // update it when configs changes ( accept, maxSize )
    const inputElement = document.createElement('input')
    inputElement.type = 'file'
    inputElement.accept = accept
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
  }, [accept, maxSize])
  const openFileDialog = useCallback(() => {
    inputRef.current?.click()
  }, [])
  const dirty = !!choosenFile
  const {
    deployments: {
      filestoreHttp: { href: filestoreHttpHref },
    },
  } = useContext(GlobalCtx)
  const submit = useCallback(() => {
    if (!dirty) return
    const formData = new FormData()
    formData.append(uploadTempFieldName, choosenFile.file)

    fetch(`${filestoreHttpHref}${uploadTempPath}`, { body: formData, method: uploadTempMethod })
      .then(r => r.json())
      .then(fileUploadedAction)
      .then(result => {
        if (!result.done) {
          setError([result.error ?? 'Unknown error'].flat().join('\n'))
          return
        }
        inputRef.current && (inputRef.current.value = '')
        if (result.newCurrent) {
          setLatestUpdatedSrc(result.newCurrent)
          setChoosenFile(null)
        }
      })
  }, [fileUploadedAction, choosenFile?.file, dirty, filestoreHttpHref])
  return [openFileDialog, submit, error, localSrc, latestUpdatedSrc, dirty] as const
}
