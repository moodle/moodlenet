import debounce from 'lodash/debounce.js'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ResourceActions, ResourceFormProps, ResourceProps, SaveState } from '../common/types.mjs'

import { useNavigate } from 'react-router-dom'
import { MainContext } from './MainContext.js'

export type Actions = {
  editResource: (res: ResourceFormProps) => Promise<ResourceFormProps>
  getResource: () => Promise<ResourceProps>
  deleteResource: () => Promise<ResourceProps>
  toggleBookmark: () => Promise<ResourceProps>
  toggleLike: () => Promise<ResourceProps>
  setIsPublished: (approve: boolean) => Promise<ResourceProps>
}

export type ResourceCommonProps = {
  actions: ResourceActions
  props: ResourceProps
  saveState: SaveState
  isSaving: boolean
  isToDelete: boolean
}
// type SaveState = { form: boolean; image: boolean; content: boolean }

type myProps = { resourceKey: string }
export const useResourceBaseProps = ({ resourceKey }: myProps) => {
  const { rpcCaller } = useContext(MainContext)
  const nav = useNavigate()
  const [resource, setResource] = useState<ResourceProps | null>()
  const [saveState, setSaveState] = useState({ form: false, image: false, content: false })
  const [isToDelete, setIsToDelete] = useState(false)

  useEffect(() => {
    rpcCaller.get(resourceKey).then(res => setResource(res))
  }, [resourceKey, rpcCaller])

  const setterSave = useCallback(
    (key: keyof SaveState, val: boolean) =>
      setSaveState(currentSaved => ({ ...currentSaved, [key]: val })),
    [],
  )
  const actions = useMemo<ResourceActions>(() => {
    const { edit: editRpc, setImage: _setImage, setIsPublished, setContent, _delete } = rpcCaller

    const edit = debounce((res: ResourceFormProps) => {
      setterSave('form', true)
      editRpc(resourceKey, res).then(() => {
        console.log('form xxx', res)
        setterSave('form', false)
      })
    }, 1000)

    const updateResource = <T,>(key: string, val: T): T => (
      resource && setResource({ ...resource, [key]: val }), val
    )
    const updateData =
      <T,>(key: string) =>
      (val: T): T => (
        !resource ? '' : updateResource('data', { ...resource.data, [key]: val }), val
      )

    const updateImageUrl = (imageUrl: string) => {
      updateData<string>('imageUrl')(imageUrl)
    }
    const resourceActions: ResourceActions = {
      async editData(res: ResourceFormProps) {
        edit(res) // .then(form => updateResource('form', 'resourceForm', form)),
      },
      async setImage(file: File | undefined | null) {
        setterSave('image', true)
        const imageUrl = await _setImage(resourceKey, file)
        updateImageUrl(imageUrl)
        setterSave('image', false)

        return imageUrl
      },
      async setContent(content: File | string | undefined | null) {
        setterSave('form', true)
        await setContent(resourceKey, content).then(updateData('contentUrl'))
        setterSave('form', false)
      },
      publish: () => setIsPublished(resourceKey, true),
      unpublish: () => setIsPublished(resourceKey, false),
      deleteResource: () => {
        setIsToDelete(true)
        return _delete(resourceKey).then(() => {
          setIsToDelete(false)
          nav('/')
        })
      },
    }
    return resourceActions
  }, [nav, resource, resourceKey, rpcCaller, setterSave])

  return useMemo<ResourceCommonProps | null>(
    () =>
      !resource
        ? null
        : {
            actions,
            props: resource,
            saveState,
            isSaving: saveState.form || saveState.image || saveState.content,
            isToDelete,
          },
    [actions, isToDelete, resource, saveState],
  )
}
