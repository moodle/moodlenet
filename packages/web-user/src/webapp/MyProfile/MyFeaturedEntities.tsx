import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type {
  KnownEntityFeature,
  KnownEntityType,
  KnownFeaturedEntities,
} from '../../common/types.mjs'
import { AuthCtx } from '../context/AuthContext.js'
import { shell } from '../shell.mjs'

const emptyFeaturedEntities: KnownFeaturedEntities = {
  bookmark: { collection: [], profile: [], resource: [] },
  follow: { collection: [], profile: [], resource: [] },
  like: { collection: [], profile: [], resource: [] },
}

export type AllMyFeaturedEntitiesHandle = {
  reload(): Promise<void>
  all: KnownFeaturedEntities
  toggle(_: {
    feature: KnownEntityFeature
    _key: string
    entityType: KnownEntityType
  }): Promise<void>
  isFeatured(_: { entityType: KnownEntityType; _key: string; feature: KnownEntityFeature }): boolean
}

export function useAllMyFeaturedEntities() {
  const authCtx = useContext(AuthCtx)
  const myProfile = authCtx.clientSessionData?.myProfile

  const [all, setAll] = useState<KnownFeaturedEntities>(emptyFeaturedEntities)

  const reload = useCallback(async () => {
    if (!myProfile) {
      setAll(emptyFeaturedEntities)
    }

    const myFeaturedEntitiesRes = await shell.rpc.me['webapp/all-my-featured-entities']()

    setAll(myFeaturedEntitiesRes?.featuredEntities ?? emptyFeaturedEntities)
  }, [myProfile])

  useEffect(() => {
    reload()
  }, [reload])

  const isFeatured = useCallback<AllMyFeaturedEntitiesHandle['isFeatured']>(
    ({ _key, entityType, feature }) => {
      return !!all[feature][entityType].find(feat => feat._key === _key)
    },
    [all],
  )

  const toggle = useCallback<AllMyFeaturedEntitiesHandle['toggle']>(
    async ({ _key, entityType, feature }) => {
      const action = isFeatured({ _key, entityType, feature }) ? 'remove' : 'add'
      await shell.rpc.me[
        'webapp/entity-social-actions/:action(add|remove)/:feature(bookmark|follow|like)/:entityType(resource|profile|collection)/:_key'
      ](void 0, { action, _key, entityType, feature })
      setAll(featuredEntities => {
        const currentList = featuredEntities[feature][entityType]
        const updatedList: { _key: string }[] =
          action === 'add'
            ? [...currentList, { _key }]
            : currentList.filter(item => item._key !== _key)

        return {
          ...featuredEntities,
          [feature]: {
            ...featuredEntities[feature],
            [entityType]: updatedList,
          },
        }
      })
    },
    [isFeatured],
  )

  const myFeaturedEntitiesContext = useMemo<AllMyFeaturedEntitiesHandle>(() => {
    const myFeaturedEntitiesContext: AllMyFeaturedEntitiesHandle = {
      all,
      isFeatured,
      reload,
      toggle,
    }
    return myFeaturedEntitiesContext
  }, [all, isFeatured, reload, toggle])

  return myFeaturedEntitiesContext
}

export type MyFeaturedEntityHandle = {
  toggle(): Promise<void>
  isFeatured: boolean
}
export function useMyFeaturedEntity({
  _key,
  feature,
  entityType,
}: {
  entityType: KnownEntityType
  feature: KnownEntityFeature
  _key: string
}) {
  const allFeatsHandle = useAllMyFeaturedEntities()
  const myFeaturedEntityHandle: MyFeaturedEntityHandle = useMemo<MyFeaturedEntityHandle>(() => {
    const isFeatured = allFeatsHandle.isFeatured({ entityType, _key, feature })
    const toggle = () => allFeatsHandle.toggle({ entityType, _key, feature })
    const handle: MyFeaturedEntityHandle = {
      isFeatured,
      toggle,
    }

    return handle
  }, [_key, allFeatsHandle, entityType, feature])

  return myFeaturedEntityHandle
}
