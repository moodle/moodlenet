import { useEffect, useMemo, useState } from 'react'
import type { KnownEntityFeature, KnownEntityType } from '../../../common/types.mjs'
import { shell } from '../shell.mjs'
import type { MyFeaturedEntityHandle } from './useMyFeaturedEntity.js'
import { useMyFeaturedEntity } from './useMyFeaturedEntity.js'

export type MyFeaturedEntityWithCountHandle = MyFeaturedEntityHandle & {
  count: number
}
export function useMyFeaturedEntityWitnCount({
  _key,
  feature,
  entityType,
}: {
  entityType: KnownEntityType
  feature: Exclude<KnownEntityFeature, 'bookmark'>
  _key: string
}) {
  const [count, setCount] = useState(-1)
  useEffect(() => {
    shell.rpc.me[
      'webapp/feature-entity/count/:feature(follow|like)/:entityType(profile|collection|resource|subject)/:_key'
    ](undefined, { feature, entityType, _key }).then(({ count }) => setCount(count))
  }, [_key, entityType, feature])
  const myFeaturedEntityHandle = useMyFeaturedEntity({ _key, entityType, feature })
  const featuredEntityWithCountHandle = useMemo<MyFeaturedEntityWithCountHandle | null>(() => {
    if (count === -1) {
      return null
    }
    const featuredEntityWithCountHandle: MyFeaturedEntityWithCountHandle = {
      ...myFeaturedEntityHandle,
      toggle: async () => {
        const delta = myFeaturedEntityHandle.isFeatured ? -1 : 1
        await myFeaturedEntityHandle.toggle()
        setCount(curr => curr + delta)
      },
      count,
    }
    return featuredEntityWithCountHandle
  }, [count, myFeaturedEntityHandle])
  return featuredEntityWithCountHandle
}
