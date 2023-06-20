import { useEffect, useMemo, useState } from 'react'
import type { KnownEntityFeature, KnownEntityType } from '../../../common/types.mjs'
import { shell } from '../shell.mjs'
import type { MyFeaturedEntityHandle } from './useMyFeaturedEntity.js'
import { useMyFeaturedEntity } from './useMyFeaturedEntity.js'

export type MyFeaturedEntityWithCountHandle = MyFeaturedEntityHandle & {
  count: number
}
export function useMyFeaturedEntityWithCount({
  feature,
  _key,
  entityType,
}: {
  feature: Exclude<KnownEntityFeature, 'bookmark'>
  _key: string
  entityType: KnownEntityType
}) {
  const [count, setCount] = useState<number>()

  const undefinedCount = count === undefined
  useEffect(() => {
    if (!undefinedCount) return
    shell.rpc.me[
      'webapp/feature-entity/count/:feature(follow|like)/:entityType(profile|collection|resource|subject)/:_key'
    ](undefined, { feature, entityType, _key }).then(({ count }) => setCount(count))
  }, [_key, undefinedCount, entityType, feature])
  const myFeaturedEntityHandle = useMyFeaturedEntity({ feature, _key, entityType })
  const featuredEntityWithCountHandle = useMemo<MyFeaturedEntityWithCountHandle>(() => {
    const featuredEntityWithCountHandle: MyFeaturedEntityWithCountHandle = {
      ...myFeaturedEntityHandle,
      toggle: async () => {
        if (undefinedCount) return
        const delta = myFeaturedEntityHandle.isFeatured ? -1 : 1
        await myFeaturedEntityHandle.toggle()
        setCount(curr => (curr ?? 0) + delta)
      },
      count: count ?? 0,
    }
    return featuredEntityWithCountHandle
  }, [count, myFeaturedEntityHandle, undefinedCount])
  return featuredEntityWithCountHandle
}
