import { useCallback, useMemo } from 'react'
import type { KnownEntityFeature, KnownEntityType } from '../../../common/types.mjs'
import { useMyProfileContext } from './MyProfileContext'

export type MyFeaturedEntityHandle = {
  toggle(): Promise<void>
  isFeatured: boolean
}
export function useMyFeaturedEntity({
  feature,
  _key,
  entityType,
}: {
  feature: KnownEntityFeature
  _key: string
  entityType: KnownEntityType
}) {
  const allFeatsHandle = useMyProfileContext()?.myFeaturedEntities
  const isFeatured = !!allFeatsHandle?.isFeatured({
    entityType,
    _key,
    feature,
  })
  const toggle = useCallback(async () => {
    allFeatsHandle?.toggle({
      entityType,
      _key,
      feature,
    })
  }, [_key, allFeatsHandle, entityType, feature])

  const myFeaturedEntityHandle = useMemo(() => {
    const handle: MyFeaturedEntityHandle = {
      isFeatured,
      toggle,
    }

    return handle
  }, [isFeatured, toggle])

  return myFeaturedEntityHandle
}
