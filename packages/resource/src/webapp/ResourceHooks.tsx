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

type myProps = { resourceKey: string }
export const useResourceBaseProps = ({ resourceKey }: myProps) => {
  const { rpcCaller } = useContext(MainContext)
  const [resource, setResource] = useState<ResourceProps | null>()

  useEffect(() => {
    rpcCaller.get(resourceKey).then(res => setResource(res))
  }, [resourceKey, rpcCaller, setResource])

  const actions = useMemo<ResourceActions>(() => {
    const updateResp = (resourceData: ResourceProps) => {
      setResource(current => current && { ...current, resourceData })
    }
    const updateRespForm = (resourceForm: ResourceFormProps): ResourceFormProps => (
      resource && updateResp({ ...resource, resourceForm }), resourceForm
    )
    const { edit, setImage, setIsPublished, setContent, _delete } = rpcCaller // toggleBookmark, toggleLike,
    const brk = (_: unknown): Promise<void> => new Promise(resolve => _ || resolve())

    return {
      publish: () => brk(setIsPublished(resourceKey, true).then(res => updateResp(res))),
      unpublish: () => brk(setIsPublished(resourceKey, false).then(updateResp)),
      editData: (values: ResourceFormProps) => edit(resourceKey, values).then(updateRespForm),
      deleteResource: () => brk(_delete(resourceKey)),
      setImage: (file: File) => brk(setImage(resourceKey, file).then(updateResp)),
      setContent: (content: File | string) => brk(setContent(resourceKey, content)),
      // toggleBookmark: () => toggleBookmark(resourceKey).then(updateResourceResp), toggleLike: () => toggleLike(resourceKey).then(updateResourceResp),
    }
  }, [resourceKey, resource, rpcCaller])

  return useMemo<ResourceCommonProps | null>(
    () => (!resource ? null : { actions, props: resource }),
    [actions, resource],
  )
}
