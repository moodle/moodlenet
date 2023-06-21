import { MainSearchBoxCtx, proxyWith, type SortType } from '@moodlenet/react-app/ui'
import {
  useUrlQueryString,
  type PkgAddOns,
  type SearchEntityPageWrapper,
  type SearchEntitySectionAddon,
} from '@moodlenet/react-app/webapp'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react'
import type { ResourceSearchResultRpc, SortTypeRpc } from '../../../../../common/types.mjs'
import { isSortTypeRpc } from '../../../../../common/types.mjs'
import { shell } from '../../../../shell.mjs'

import { useResourceCardProps } from '../../ResourceCard/ResourceCardHook.js'
import { BrowserResourceFilters } from './BrowserResourceFilters.js'
import type { BrowserResourceListDataProps } from './BrowserResourceList.js'
import BrowserResourceList from './BrowserResourceList.js'

type ResourceListItem = { _key: string }
type SearchResourceContextT = {
  sortType: SortType
  setSortType: (sortType: SortType) => void
  resourceList: ResourceListItem[]
  loadMore(): void
}

function reducer(prev: ResourceListItem[], [action, list]: ['set' | 'more', ResourceListItem[]]) {
  const keepList = action === 'set' ? [] : prev
  return [...keepList, ...list]
}
export const SearchResourceContext = createContext<SearchResourceContextT>(null as any)
export const ProvideSearchResourceContext: FC<PropsWithChildren> = ({ children }) => {
  const [resourceList, resourceListAction] = useReducer(reducer, [])
  const [resourceSearchResult, setResourceSearchResult] = useState<ResourceSearchResultRpc>()
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
      setResourceSearchResult(res)
      return res
    },
    [q, sortType],
  )

  useEffect(() => {
    load().then(res => {
      resourceListAction(['set', res.list])
    })
  }, [load])

  const hasNoMore = !!resourceSearchResult && !resourceSearchResult.endCursor
  const loadMore = useCallback(async () => {
    if (hasNoMore) {
      return
    }
    const res = await load(resourceSearchResult?.endCursor)
    resourceListAction(['more', res.list])
  }, [hasNoMore, load, resourceSearchResult?.endCursor])

  const setSortType = useCallback<SearchResourceContextT['setSortType']>(
    sortType => {
      setQueryUrlParams({ sortType })
    },
    [setQueryUrlParams],
  )
  const ctx: SearchResourceContextT = { resourceList, loadMore, setSortType, sortType }
  return <SearchResourceContext.Provider value={ctx}>{children}</SearchResourceContext.Provider>
}

export const SearchResourceSectionAddon: PkgAddOns<SearchEntitySectionAddon> = {
  resources: {
    Item: browserMainColumnItemBase => {
      const { resourceList, loadMore } = useContext(SearchResourceContext)

      const BrowserResourceListDataProps: BrowserResourceListDataProps = {
        resourceCardPropsList: resourceList.map(({ _key }) => {
          return {
            key: _key,
            props: proxyWith(function useProxy() {
              return { props: useResourceCardProps(_key) }
            }),
          }
        }),
        loadMore,
      }

      return (
        <BrowserResourceList {...BrowserResourceListDataProps} {...browserMainColumnItemBase} />
      )
    },
    filters: [
      {
        key: 'sort-by',
        Item: () => {
          const { sortType, setSortType } = useContext(SearchResourceContext)
          return <BrowserResourceFilters.SortByItem selected={sortType} setSelected={setSortType} />
        },
      },
    ],
    name: 'Resources',
  },
}

export const SearchResourceWrapperAddon: PkgAddOns<SearchEntityPageWrapper> = {
  default: { Wrapper: ProvideSearchResourceContext },
}
