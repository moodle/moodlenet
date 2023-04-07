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
    const updateResource = <T,>(state: keyof SaveState, key: string, val: T): T => (
      resource && setResource({ ...resource, [key]: val }), setterSave(state, false), val
    )
    const updateData =
      <T,>(state: keyof SaveState, key: string) =>
      (val: T) => (
        !resource ? '' : updateResource(state, 'data', { ...resource.data, [key]: val }), val
      )

    const { edit, setImage, setIsPublished, setContent, _delete } = rpcCaller // toggleBookmark, toggleLike,
    const resourceActions: ResourceActions = {
      async editData(res: ResourceFormProps) {
        setterSave('form', true)
        debounce(() =>
          edit(resourceKey, res).then(form => updateResource('form', 'resourceForm', form)),
        )
      },
      async setImage(file: File) {
        setterSave('image', true)
        return setImage(resourceKey, file).then(updateData('image', 'imageUrl'))
      },
      setContent(content: File | string) {
        setterSave('content', true)
        setContent(resourceKey, content).then(updateData('content', 'contentUrl'))
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
