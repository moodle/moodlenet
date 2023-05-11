import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { FeaturedEntity, KnownEntityFeature } from '../common/types.mjs'
import { AuthCtx } from './context/AuthContext.js'
import { MainContext } from './context/MainContext.mjs'

export type MyProfileContextT = {
  reloadMyFeaturedEntities(): Promise<void>
  myFeaturedEntities: FeaturedEntity[]
  featureEntity(_: {
    feature: KnownEntityFeature
    action: 'add' | 'remove'
    entity_id: string
  }): Promise<void>
}
export const MyProfileContext = createContext<MyProfileContextT | null>(null)

export function useMyProfileContextValue() {
  const {
    use: { me },
  } = useContext(MainContext)
  const authCtx = useContext(AuthCtx)
  const myProfile = authCtx.clientSessionData?.myProfile

  const [myFeaturedEntities, setMyFeaturedEntities] = useState<FeaturedEntity[]>([])
  const reloadMyFeaturedEntities = useCallback(async () => {
    if (!myProfile) {
      setMyFeaturedEntities([])
    }

    const { featuredEntities } = await me.rpc['webapp/all-my-featured-entities']()
    setMyFeaturedEntities(featuredEntities)
  }, [me.rpc, myProfile])

  useEffect(() => {
    reloadMyFeaturedEntities()
  }, [reloadMyFeaturedEntities])

  const featureEntity = useCallback<MyProfileContextT['featureEntity']>(
    async ({ entity_id, action, feature }) => {
      await me.rpc[
        'webapp/feature-entity/:action(add|remove)/:feature(bookmark|follow|like)/:entity_id'
      ](void 0, { action, entity_id: entity_id, feature })
      setMyFeaturedEntities(featuredEntities =>
        action === 'add'
          ? [...featuredEntities, { _id: entity_id, feature }]
          : featuredEntities.filter(item => item._id === entity_id && item.feature === feature),
      )
    },
    [me.rpc],
  )

  const myProfileContext = useMemo<MyProfileContextT>(() => {
    const myProfileContext: MyProfileContextT = {
      myFeaturedEntities,
      reloadMyFeaturedEntities,
      featureEntity,
    }
    return myProfileContext
  }, [myFeaturedEntities, reloadMyFeaturedEntities, featureEntity])

  return myProfileContext
}

export const MyProfileContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const profileContext = useMyProfileContextValue()
  return <MyProfileContext.Provider value={profileContext}>{children}</MyProfileContext.Provider>
}
