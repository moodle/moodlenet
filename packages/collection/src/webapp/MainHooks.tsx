import { useContext, useEffect, useMemo, useState } from 'react'
import {
  CollectionActions,
  CollectionDataResponce,
  CollectionFormValues,
  MainPropsCollection,
} from '../common/types.mjs'

import { MainContext } from './MainContext.js'

export const useMainHook = ({
  collectionKey,
}: {
  collectionKey: string
}): MainPropsCollection | null => {
  const {
    rpcCaller,
    // auth: { isAdmin, isAuthenticated },
  } = useContext(MainContext)
  const [resourceResp, setResourceResp] = useState<CollectionDataResponce | null>()

  useEffect(() => {
    rpcCaller.get(collectionKey).then(data => setResourceResp(data as CollectionDataResponce))
  }, [collectionKey, rpcCaller, setResourceResp])

  const actions = useMemo<CollectionActions>(() => {
    const updateResourceResp = (resourceData: unknown) =>
      setResourceResp(current => current && { ...current, resourceData })
    const updateResourceRespForm = (resourceForm: unknown) =>
      resourceForm && resourceResp && updateResourceResp({ ...resourceResp, resourceForm })

    const {
      _delete,
      edit,
      setIsPublished,
      // toggleFollow,
      // toggleBookmark
    } = rpcCaller
    return {
      editCollection: (res: CollectionFormValues) =>
        edit(collectionKey, res).then(updateResourceRespForm),
      deleteCollection: () => _delete(collectionKey).then(updateResourceResp),
      setIsPublished: (publish: boolean) =>
        setIsPublished(collectionKey, publish) as unknown as (publish: boolean) => void,
      // toggleFollow: () => toggleFollow(collectionKey) as unknown,
      // toggleBookmark: () => toggleBookmark(collectionKey) as unknown,
    }
  }, [collectionKey, resourceResp, rpcCaller])

  return useMemo<MainPropsCollection | null>((): MainPropsCollection | null => {
    if (!resourceResp || !actions) return null

    return {
      actions,
      props: resourceResp,
    }
  }, [actions, resourceResp])
}
