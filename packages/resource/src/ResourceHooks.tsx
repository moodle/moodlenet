import { useContext, useEffect, useMemo, useState } from 'react'
import { ResourceActions, ResourceFormValues, ResourceTypeForm } from './common.mjs'

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

export const useResourceBaseProps = ({
  resourceKey,
}: {
  resourceKey: string
}): ResourceCommonProps | null => {
  const {
    rpcCaller,
    // auth: { isAdmin, isAuthenticated },
  } = useContext(MainContext)
  const [resourceResp, setResourceResp] = useState<ResourceTypeForm | null>()

  useEffect(() => {
    rpcCaller.get(resourceKey).then(setResourceResp)
  }, [resourceKey, rpcCaller, setResourceResp])

  const actions = useMemo<ResourceActions>(() => {
    const updateResourceResp = (resourceData: ResourceTypeForm) =>
      setResourceResp(current => current && { ...current, resourceData })
    const updateResourceRespForm = (resourceForm: ResourceFormValues) =>
      resourceForm && resourceResp && updateResourceResp({ ...resourceResp, resourceForm })

    const { edit, setIsPublished, toggleBookmark, toggleLike, _delete } = rpcCaller
    return {
      editResource: (res: ResourceFormValues) =>
        edit(resourceKey, res).then(updateResourceRespForm),
      // getResource: () => get(resourceKey).then(setResourceResp),
      deleteResource: () => _delete(resourceKey).then(updateResourceResp),
      toggleBookmark: () => toggleBookmark(resourceKey).then(updateResourceResp),
      toggleLike: () => toggleLike(resourceKey).then(updateResourceResp),
      setIsPublished: (publish: boolean): void => {
        setIsPublished(resourceKey, publish).then(updateResourceResp)
      },
    }
  }, [resourceKey, resourceResp, rpcCaller])

  return useMemo<ResourceCommonProps | null>((): ResourceCommonProps | null => {
    if (!resourceResp || !actions) return null

    return {
      actions,
      props: resourceResp,
    }
  }, [actions, resourceResp])
}
