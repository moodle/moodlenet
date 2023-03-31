import { useContext, useEffect, useMemo, useState } from 'react'
import { ResourceActions, ResourceFormValues, ResourceTypeForm } from '../common.mjs'

import { MainContext } from './MainContext.js'

export type Actions = {
  editResource: (res: ResourceFormValues) => Promise<ResourceFormValues>
  getResource: () => Promise<ResourceTypeForm>
  deleteResource: () => Promise<ResourceTypeForm>
  toggleBookmark: () => Promise<ResourceTypeForm>
  toggleLike: () => Promise<ResourceTypeForm>
  setIsPublished: (approve: boolean) => void
}

export type ResourceCommonProps = {
  actions: ResourceActions
  props: ResourceTypeForm
}

type myProps = { resourceKey: string }
export const useResourceBaseProps = ({ resourceKey }: myProps) => {
  const { rpcCaller } = useContext(MainContext)
  const [resource, setResource] = useState<ResourceTypeForm | null>()

  useEffect(() => {
    rpcCaller.get(resourceKey).then(setResource)
  }, [resourceKey, rpcCaller, setResource])

  const actions = useMemo<ResourceActions>(() => {
    const updateResp = (resourceData: ResourceTypeForm) =>
      setResource(current => current && { ...current, resourceData })
    const updateRespForm = (resourceForm: ResourceFormValues): ResourceFormValues => (
      resource && updateResp({ ...resource, resourceForm }), resourceForm
    )
    const { edit, setImage, setIsPublished, setContent, _delete } = rpcCaller // toggleBookmark, toggleLike,

    return {
      publish: () => setIsPublished(resourceKey, true).then(updateResp),
      unpublish: () => setIsPublished(resourceKey, false).then(updateResp),
      editData: (values: ResourceFormValues) => edit(resourceKey, values).then(updateRespForm),
      deleteResource: () => _delete(resourceKey).then(updateResp),
      setImage: (file: File) => setImage(resourceKey, file),
      setContent: (content: File | string) => setContent(resourceKey, content),
      // toggleBookmark: () => toggleBookmark(resourceKey).then(updateResourceResp), toggleLike: () => toggleLike(resourceKey).then(updateResourceResp),
    }
  }, [resourceKey, resource, rpcCaller])

  return useMemo<ResourceCommonProps | null>(
    () => (!resource ? null : { actions, props: resource }),
    [actions, resource],
  )
}
