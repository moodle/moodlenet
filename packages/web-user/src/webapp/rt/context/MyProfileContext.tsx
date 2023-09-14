import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type {
  KnownEntityFeature,
  KnownEntityType,
  KnownFeaturedEntities,
  Profile,
  UserInterests,
} from '../../../common/types.mjs'
import { shell } from '../shell.mjs'
import { AuthCtx } from './AuthContext.js'

export type MyProfileContextT = {
  myFeaturedEntities: AllMyFeaturedEntitiesHandle
  myInterests: MyInterestsHandle
  myProfile: Profile & { publisher: boolean }
}
export const MyProfileContext = createContext<MyProfileContextT | null>(null)
export function useMyProfileContext() {
  return useContext(MyProfileContext)
}

export const MyProfileContextProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const myProfileContext = useMyProfileContextValue()
  return <MyProfileContext.Provider value={myProfileContext}>{children}</MyProfileContext.Provider>
}

function useMyProfileContextValue() {
  const authCtx = useContext(AuthCtx)
  const myProfile = authCtx.clientSessionData?.myProfile
  const myFeaturedEntities = useAllMyFeaturedEntities()
  const myInterests = useMyInterests()
  const myProfileContext = useMemo<MyProfileContextT | null>(() => {
    if (!myProfile) {
      return null
    }
    const myProfileContext: MyProfileContextT = {
      myFeaturedEntities,
      myProfile,
      myInterests,
    }
    return myProfileContext
  }, [myFeaturedEntities, myProfile, myInterests])

  return myProfileContext
}

const emptyFeaturedEntities: KnownFeaturedEntities = {
  bookmark: { subject: [], collection: [], profile: [], resource: [] },
  follow: { subject: [], collection: [], profile: [], resource: [] },
  like: { subject: [], collection: [], profile: [], resource: [] },
}

const emptyUserInterests: UserInterests = {
  languages: [],
  levels: [],
  licenses: [],
  subjects: [],
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
export type MyInterestsHandle = {
  reload(): Promise<void>
  current: UserInterests
  save(_: UserInterests): Promise<void>
}
function useAllMyFeaturedEntities() {
  const authCtx = useContext(AuthCtx)
  const myProfile = authCtx.clientSessionData?.myProfile

  const [all, setAll] = useState<KnownFeaturedEntities>(emptyFeaturedEntities)

  const reload = useCallback(async () => {
    if (!myProfile) {
      setAll(emptyFeaturedEntities)
    }

    const rpcResponse = await shell.rpc.me('webapp/all-my-featured-entities')()

    setAll(rpcResponse?.featuredEntities ?? emptyFeaturedEntities)
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
      await shell.rpc.me(
        'webapp/entity-social-actions/:action(add|remove)/:feature(bookmark|follow|like)/:entityType(resource|profile|collection|subject)/:_key',
      )(void 0, { action, _key, entityType, feature })
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

function useMyInterests() {
  const authCtx = useContext(AuthCtx)
  const myProfile = authCtx.clientSessionData?.myProfile

  const [myInterests, setMyInterests] = useState<UserInterests>(emptyUserInterests)

  const reload = useCallback(async () => {
    if (!myProfile) {
      setMyInterests(emptyUserInterests)
    }

    const rpcResponse = await shell.rpc.me('webapp/get-my-interests')()

    setMyInterests(rpcResponse?.myInterests ?? emptyUserInterests)
  }, [myProfile])

  useEffect(() => {
    reload()
  }, [reload])

  const save = useCallback<MyInterestsHandle['save']>(async myInterests => {
    await shell.rpc.me('webapp/save-my-interests')({ myInterests })
    setMyInterests(myInterests)
  }, [])

  const myFeaturedEntitiesContext = useMemo<MyInterestsHandle>(() => {
    const myFeaturedEntitiesContext: MyInterestsHandle = {
      current: myInterests,
      reload,
      save,
    }
    return myFeaturedEntitiesContext
  }, [myInterests, reload, save])

  return myFeaturedEntitiesContext
}
