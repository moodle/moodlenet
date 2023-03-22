import { useContext, useEffect, useMemo, useState } from 'react'
import {
  GetResponce,
  ResourceComonProps,
  ResourceFormValues,
  ResourceTypeForm,
  ResponceFormAndKey,
} from '../common.mjs'
import { MainContext } from './MainContext.js'

export const useResourceBaseProps = ({ resourceKey }: { resourceKey: string }) => {
  const {
    rpcCaller,
    // auth: { isAdmin, isAuthenticated },
  } = useContext(MainContext)
  const [resourceResp, setResourceResp] = useState<GetResponce | null>()

  useEffect(() => {
    rpcCaller.get(resourceKey).then(setResourceResp)
  }, [resourceKey, rpcCaller, setResourceResp])

  const actions = useMemo(() => {
    const updateResourceResp = (resourceData: ResourceTypeForm) =>
      setResourceResp(current => current && { ...current, resourceData })
    const updateResourceRespForm = (a: ResponceFormAndKey) =>
      resourceResp &&
      updateResourceResp({ ...resourceResp.resourceData, resource: a.resourceFormData })

    const { edit, get, setIsPublished, toggleBookmark, toggleLike, _delete } = rpcCaller
    return {
      editResource: (res: ResourceFormValues) =>
        edit(resourceKey, res).then(updateResourceRespForm),
      getResource: () => get(resourceKey).then(setResourceResp),
      deleteResource: () => _delete(resourceKey).then(updateResourceResp),
      toggleBookmark: () => toggleBookmark(resourceKey).then(updateResourceResp),
      toggleLike: () => toggleLike(resourceKey).then(updateResourceResp),
      setIsPublished: (approve: boolean): void => {
        setIsPublished(resourceKey, approve).then(updateResourceResp)
      },
    }
  }, [resourceKey, resourceResp, rpcCaller, setResourceResp])

  const props = useMemo<ResourceComonProps | null>((): ResourceComonProps | null => {
    if (!resourceResp || !actions) return null
    const { flags } = resourceResp

    return {
      ...actions,
      ...flags,
      ...resourceResp.authFlags,
      ...resourceResp.resourceData,
    }
  }, [actions, resourceResp])

  return {
    resourceKey,
    props,
    actions,
    flags: resourceResp?.flags,
    contributor: resourceResp?.contributor,
  }
}
