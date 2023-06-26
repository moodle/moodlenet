import { MainSearchBoxCtx, proxyWith, type SortType } from '@moodlenet/react-app/ui'
import {
  useUrlQueryString,
  type PkgAddOns,
  type SearchEntityPageWrapper,
  type SearchEntitySectionAddon,
} from '@moodlenet/react-app/webapp'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react'
import type { ProfileSearchResultRpc, SortTypeRpc } from '../../../../common/types.mjs'
import { isSortTypeRpc } from '../../../../common/types.mjs'
import type { BrowserProfileListDataProps } from '../../../ui/exports/ui.mjs'
import { BrowserProfileFilters, BrowserProfileList } from '../../../ui/exports/ui.mjs'
import { useProfileCardProps } from '../../organisms/ProfileCardHooks.js'
import { shell } from '../../shell.mjs'

type ProfileListItem = { _key: string }
type SearchProfileContextT = {
  sortType: SortType
  setSortType: (sortType: SortType) => void
  profileList: ProfileListItem[]
  loadMore(): void
}

function reducer(prev: ProfileListItem[], [action, list]: ['set' | 'more', ProfileListItem[]]) {
  const keepList = action === 'set' ? [] : prev
  return [...keepList, ...list]
}
export const SearchProfileContext = createContext<SearchProfileContextT>(null as any)
export const ProvideSearchProfileContext: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [profileList, profileListAction] = useReducer(reducer, [])
  const [profileSearchResult, setProfileSearchResult] = useState<ProfileSearchResultRpc>()
  const { q } = useContext(MainSearchBoxCtx)
  const [queryUrlParams, setQueryUrlParams] = useUrlQueryString(['sortType'], shell.pkgId.name)
  const sortType: SortTypeRpc = isSortTypeRpc(queryUrlParams.sortType)
    ? queryUrlParams.sortType
    : 'Popular'

  const load = useCallback(
    async (cursor?: string) => {
      const res = await shell.rpc.me['webapp/search'](undefined, undefined, {
        limit: 10,
        sortType,
        text: q,
        after: cursor,
      })
      setProfileSearchResult(res)
      return res
    },
    [q, sortType],
  )

  useEffect(() => {
    load().then(res => {
      profileListAction(['set', res.list])
    })
  }, [load])

  const hasNoMore = !!profileSearchResult && !profileSearchResult.endCursor
  const loadMore = useCallback(async () => {
    if (hasNoMore) {
      return
    }
    const res = await load(profileSearchResult?.endCursor)
    profileListAction(['more', res.list])
  }, [hasNoMore, load, profileSearchResult?.endCursor])

  const setSortType = useCallback<SearchProfileContextT['setSortType']>(
    sortType => {
      setQueryUrlParams({ sortType })
    },
    [setQueryUrlParams],
  )
  const ctx: SearchProfileContextT = { profileList, loadMore, setSortType, sortType }
  return <SearchProfileContext.Provider value={ctx}>{children}</SearchProfileContext.Provider>
}

export const SearchProfileSectionAddon: PkgAddOns<SearchEntitySectionAddon> = {
  profiles: {
    Item: browserMainColumnItemBase => {
      const { profileList, loadMore } = useContext(SearchProfileContext)

      const BrowserProfileListDataProps: BrowserProfileListDataProps = {
        profilesCardPropsList: profileList.map(({ _key }) => {
          return {
            key: _key,
            props: proxyWith(function useProxy() {
              return { props: useProfileCardProps(_key) }
            }),
          }
        }),
        loadMore,
      }

      return <BrowserProfileList {...BrowserProfileListDataProps} {...browserMainColumnItemBase} />
    },
    filters: [
      {
        key: 'sort-by',
        Item: () => {
          const { sortType, setSortType } = useContext(SearchProfileContext)
          return <BrowserProfileFilters.SortByItem selected={sortType} setSelected={setSortType} />
        },
      },
    ],
    name: 'People',
  },
}

export const SearchProfileWrapperAddon: PkgAddOns<SearchEntityPageWrapper> = {
  default: { Wrapper: ProvideSearchProfileContext },
}
