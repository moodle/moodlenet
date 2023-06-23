import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ResourceActions, ResourceFormProps, ResourceProps } from '../common/types.mjs'

import { useNavigate } from 'react-router-dom'
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
  isSaving: boolean
  isToDelete: boolean
}
type SaveState = { form: boolean; image: boolean; content: boolean }

type myProps = { resourceKey: string }
export const useResourceBaseProps = ({ resourceKey }: myProps) => {
  const { rpcCaller } = useContext(MainContext)
  const nav = useNavigate()
  const [resource, setResource] = useState<ResourceProps | null>()
  const [saveState, setSaveState] = useState<SaveState>({
    form: false,
    image: false,
    content: false,
  })
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
  const actions = useMemo<ResourceActions>(() => {
    const { edit: editRpc, setImage: _setImage, setIsPublished, setContent, _delete } = rpcCaller

    const updateResource = <T,>(key: string, val: T): T => (
      resource && setResource({ ...resource, [key]: val }), val
    )
    const updateData =
      <T,>(key: string) =>
      (val: T): T => (
        !resource ? '' : updateResource('data', { ...resource.data, [key]: val }), val
      )

    const updateImageUrl = (imageUrl: string | null) => {
      updateData<string | null>('imageUrl')(imageUrl)
    }
    const resourceActions: ResourceActions = {
      async editData(res: ResourceFormProps) {
        setterSave('form', true)
        editRpc(resourceKey, res).then(() => {
          setterSave('form', false)
        }) // .then(form => updateResource('form', 'resourceForm', form)),
      },
      async setImage(file: File | undefined | null) {
        setterSave('image', true)
        const imageUrl = await _setImage(resourceKey, file)
        updateImageUrl(imageUrl)
        setterSave('image', false)

        return imageUrl
      },
      async setContent(content: File | string | undefined | null) {
        setterSave('content', true)
        await setContent(resourceKey, content).then(updateData('contentUrl'))
        setterSave('content', false)
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
          nav('/')
        })
      },
    }
    return resourceActions
  }, [nav, resource, resourceKey, rpcCaller, setterSave])

  return useMemo<ResourceCommonProps | null | undefined>(
    () =>
      !resource
        ? resource
        : {
            actions,
            props: { ...resource, state: { ...resource.state, isPublished } },
            saveState,
            isSaving: saveState.form || saveState.image || saveState.content,
            isToDelete,
          },
    [actions, isPublished, isToDelete, resource, saveState],
  )
}
