import { useContext, useEffect, useMemo, useState } from 'react'
import { ResourceActions, ResourceFormValues, ResourceMainProps } from '../common.mjs'

import { MainContext } from './MainContext.js'

export type Actions = {
  editResource: (res: ResourceFormValues) => Promise<ResourceFormValues>
  getResource: () => Promise<ResourceMainProps>
  deleteResource: () => Promise<ResourceMainProps>
  toggleBookmark: () => Promise<ResourceMainProps>
  toggleLike: () => Promise<ResourceMainProps>
  setIsPublished: (approve: boolean) => Promise<ResourceMainProps>
}

export type ResourceCommonProps = {
  actions: ResourceActions
  props: ResourceMainProps
}

type myProps = { resourceKey: string }
export const useResourceBaseProps = ({ resourceKey }: myProps) => {
  const { rpcCaller } = useContext(MainContext)
  const [resource, setResource] = useState<ResourceMainProps | null>()

  useEffect(() => {
    rpcCaller.get(resourceKey).then(res => setResource(res))
  }, [resourceKey, rpcCaller, setResource])

  const actions = useMemo<ResourceActions>(() => {
    const updateResp = (resourceData: ResourceMainProps) => {
      setResource(current => current && { ...current, resourceData })
    }
    const updateRespForm = (resourceForm: ResourceFormValues): ResourceFormValues => (
      resource && updateResp({ ...resource, resourceForm }), resourceForm
    )
    const { edit, setImage, setIsPublished, setContent, _delete } = rpcCaller // toggleBookmark, toggleLike,
    const brk = (_: unknown): Promise<void> => new Promise(resolve => _ || resolve())

    return {
      publish: () => brk(setIsPublished(resourceKey, true).then(res => updateResp(res))),
      unpublish: () => brk(setIsPublished(resourceKey, false).then(updateResp)),
      editData: (values: ResourceFormValues) => edit(resourceKey, values).then(updateRespForm),
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
