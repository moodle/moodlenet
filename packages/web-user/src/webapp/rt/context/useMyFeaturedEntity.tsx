import { useMemo } from 'react'
import type { KnownEntityFeature, KnownEntityType } from '../../../common/types.mjs'
import { useMyProfileContext } from './MyProfileContext.js'

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
  const allFeatsHandle = useMyProfileContext()?.myFeaturedEntities
  const myFeaturedEntityHandle: MyFeaturedEntityHandle = useMemo<MyFeaturedEntityHandle>(() => {
    const isFeatured = !!allFeatsHandle?.isFeatured({ entityType, _key, feature })
    const toggle = async () => {
      allFeatsHandle?.toggle({ entityType, _key, feature })
    }
    const handle: MyFeaturedEntityHandle = {
      isFeatured,
      toggle,
    }

    return handle
  }, [_key, allFeatsHandle, entityType, feature])

  return myFeaturedEntityHandle
}
