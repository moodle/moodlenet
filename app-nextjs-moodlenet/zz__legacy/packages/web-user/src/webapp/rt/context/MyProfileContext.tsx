import type { SortTypeRpc } from '@moodlenet/ed-resource/common'
import { useResourceSearchQuery } from '@moodlenet/ed-resource/webapp'
import type { Href } from '@moodlenet/react-app/common'
import { href, searchPagePath } from '@moodlenet/react-app/common'
import { MainSearchBoxCtx } from '@moodlenet/react-app/ui'
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
import type { AuthCtxT } from './AuthContext.js'
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
  const myInterests = useMyInterests(authCtx)
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
  promptUserSetInterests: boolean
  save(_: UserInterests | 'empty'): Promise<void>
  isDefaultSearchFiltersEnabled: boolean
  toggleDefaultSearchFilters(): void
  searchPageDefaults: {
    query:
      | {
          qString: string
          qMap: Record<string, string | undefined>
        }
      | undefined
    href: Href
  }
}

function useAllMyFeaturedEntities() {
  const authCtx = useContext(AuthCtx)
  const myProfile = authCtx.clientSessionData?.myProfile

  const [all, setAll] = useState<KnownFeaturedEntities>(emptyFeaturedEntities)

  const reload = useCallback(async () => {
    const rpcResponse = await shell.rpc.me('webapp/all-my-featured-entities')()

    setAll(rpcResponse?.featuredEntities ?? emptyFeaturedEntities)
  }, [])

  useEffect(() => {
    setAll(emptyFeaturedEntities)
    reload()
  }, [reload, myProfile])

  const isFeatured = useCallback<AllMyFeaturedEntitiesHandle['isFeatured']>(
    ({ _key, entityType, feature }) => {
      return !!all[feature][entityType].find(feat => feat._key === _key)
    },
    [all],
  )
  const [toggleFeatOngoing, setToggleFeatOngoing] = useState(false)
  const toggle = useCallback<AllMyFeaturedEntitiesHandle['toggle']>(
    async ({ _key, entityType, feature }) => {
      if (toggleFeatOngoing) {
        return
      }
      setToggleFeatOngoing(true)
      const action = isFeatured({ _key, entityType, feature }) ? 'remove' : 'add'
      await shell.rpc.me(
        'webapp/entity-social-actions/:action(add|remove)/:feature(bookmark|follow|like)/:entityType(resource|profile|collection|subject)/:_key',
      )(void 0, { action, _key, entityType, feature })
      setToggleFeatOngoing(false)
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
    [isFeatured, toggleFeatOngoing],
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

function useMyInterests(authCtx: AuthCtxT) {
  const myProfile = authCtx.clientSessionData?.myProfile

  const [myInterests, setMyInterests] = useState<UserInterests | undefined | 'loading' | 'anon'>(
    'loading',
  )
  const [myInterestsAsDefaultFilters, setMyInterestsAsDefaultFilters] = useState<
    boolean | 'loading' | 'anon' | undefined
  >('loading')

  const reload = useCallback(async () => {
    const rpcResponse = await shell.rpc.me('webapp/my-interests/get')()
    setMyInterests(!rpcResponse ? 'anon' : rpcResponse.interests)
    setMyInterestsAsDefaultFilters(!rpcResponse ? 'anon' : !!rpcResponse.asDefaultFilters)
  }, [])

  useEffect(() => {
    setMyInterests('loading')
    setMyInterestsAsDefaultFilters('loading')
    reload()
  }, [myProfile, reload])

  const save = useCallback<MyInterestsHandle['save']>(
    async choosenInterestsToSave => {
      const myInterestsToSave =
        choosenInterestsToSave === 'empty' ? emptyUserInterests : choosenInterestsToSave
      const done = await shell.rpc.me('webapp/my-interests/save')({
        interests: myInterestsToSave,
      })
      done ? setMyInterests(myInterestsToSave) : reload()
    },
    [reload],
  )

  const toggleDefaultSearchFilters = useCallback<
    MyInterestsHandle['toggleDefaultSearchFilters']
  >(() => {
    setMyInterestsAsDefaultFilters(!myInterestsAsDefaultFilters)
    shell.rpc
      .me('webapp/my-interests/use-as-default-search-filters')({
        use: !myInterestsAsDefaultFilters,
      })
      .then(done => {
        if (!done) {
          reload()
        }
      })
  }, [myInterestsAsDefaultFilters, reload])

  const mainSearchBoxCtx = useContext(MainSearchBoxCtx)
  const [, , makeSearchQuery, { ls2str }] = useResourceSearchQuery()
  const defaultSearchPageQuery = useMemo(() => {
    const relevanceSort: SortTypeRpc = 'Relevant'
    return !myInterests || myInterests === 'loading' || myInterests === 'anon'
      ? undefined
      : makeSearchQuery({
          sortType: relevanceSort,
          languages: ls2str(myInterests.languages),
          levels: ls2str(myInterests.levels),
          licenses: ls2str(myInterests.licenses),
          subjects: ls2str(myInterests.subjects),
        })
  }, [myInterests, makeSearchQuery, ls2str])

  const defaultSearchHref = href(searchPagePath({ q: defaultSearchPageQuery?.qString }))

  const mainSearchBoxCtxSetDefaultQuery = mainSearchBoxCtx.setDefaultQuery
  useEffect(() => {
    mainSearchBoxCtxSetDefaultQuery(
      defaultSearchPageQuery?.qMap && myInterestsAsDefaultFilters
        ? defaultSearchPageQuery.qMap
        : {},
    )
  }, [defaultSearchPageQuery?.qMap, mainSearchBoxCtxSetDefaultQuery, myInterestsAsDefaultFilters])
  const useAsCurrentInterests =
    !myInterests || myInterests === 'loading' || myInterests === 'anon'
      ? emptyUserInterests
      : myInterests
  const promptUserSetInterests = (() => {
    if (!myProfile || myInterests === 'loading' || myInterests === 'anon') {
      return false
    } else if (myInterests) {
      return false
    } else {
      return true
    }
  })()
  const myInterestsHandle = useMemo<MyInterestsHandle>(() => {
    const myInterestsHandle: MyInterestsHandle = {
      current: useAsCurrentInterests,
      promptUserSetInterests,
      reload,
      save,
      isDefaultSearchFiltersEnabled: !!myInterestsAsDefaultFilters,
      toggleDefaultSearchFilters,
      searchPageDefaults: {
        query: defaultSearchPageQuery,
        href: defaultSearchHref,
      },
    }
    return myInterestsHandle
  }, [
    useAsCurrentInterests,
    promptUserSetInterests,
    reload,
    save,
    myInterestsAsDefaultFilters,
    toggleDefaultSearchFilters,
    defaultSearchPageQuery,
    defaultSearchHref,
  ])

  return myInterestsHandle
}
