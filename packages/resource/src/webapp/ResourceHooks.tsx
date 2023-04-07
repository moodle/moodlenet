import debounce from 'lodash/debounce.js'
import { useContext, useEffect, useMemo, useState } from 'react'
import { ResourceActions, ResourceFormProps, ResourceProps } from '../common.mjs'

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
}
type SaveState = { form: boolean; image: boolean; content: boolean }

type myProps = { resourceKey: string }
export const useResourceBaseProps = ({ resourceKey }: myProps) => {
  const { rpcCaller } = useContext(MainContext)
  const [resource, setResource] = useState<ResourceProps | null>()
  const [saved, setSaved] = useState<SaveState>({ form: false, image: false, content: false })

  useEffect(() => {
    rpcCaller.get(resourceKey).then(res => setResource(res))
  }, [resourceKey, rpcCaller, setResource])

  const actions = useMemo<ResourceActions>(() => {
    const setterSave = (key: keyof SaveState, val: boolean) => setSaved({ ...saved, [key]: val })
    const updateResource = <T,>(key: string, val: T): typeof resource =>
      resource && { ...resource, [key]: val }
    const updateData = <T,>(key: string, val: T) => updateResource('data', { [key]: val })

    const updateImageUrl = (imageUrl: string) => (
      setterSave('image', false), setResource(updateData('imageUrl', imageUrl)), imageUrl
    )
    const updateContent = (contentUrl: string) => (
      setterSave('content', false), setResource(updateData('contentUrl', contentUrl)), contentUrl
    )

    const { edit, setImage, setIsPublished, setContent, _delete } = rpcCaller // toggleBookmark, toggleLike,
    const resourceActions: ResourceActions = {
      async editData(res: ResourceFormProps) {
        setterSave('form', true)
        debounce(() => edit(resourceKey, res).then(() => setterSave('form', false))) // edit(collectionKey, file).then(() => setterSave('data', false))
      },
      async setImage(file: File) {
        setterSave('image', true)
        return setImage(resourceKey, file).then(updateImageUrl)
      },
      setContent(content: File | string) {
        setterSave('content', true)
        setContent(resourceKey, content).then(updateContent)
      },
      publish: () => setIsPublished(resourceKey, true),
      unpublish: () => setIsPublished(resourceKey, false),
      deleteResource: () => _delete(resourceKey),
    }
    return resourceActions
  }, [resource, resourceKey, rpcCaller, saved])

  return useMemo<ResourceCommonProps | null>(
    () => (!resource ? null : { actions, props: resource }),
    [actions, resource],
  )
}
