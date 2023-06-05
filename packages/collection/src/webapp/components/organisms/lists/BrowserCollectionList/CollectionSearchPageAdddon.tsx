import { MainSearchBoxCtx, proxyWith, type SortType } from '@moodlenet/react-app/ui'
import {
  useUrlQueryString,
  type PkgAddOns,
  type SearchEntityPageWrapper,
  type SearchEntitySectionAddon,
} from '@moodlenet/react-app/webapp'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react'
import type { CollectionSearchResultRpc, SortTypeRpc } from '../../../../../common/types.mjs'
import { isSortTypeRpc } from '../../../../../common/types.mjs'
import { shell } from '../../../../shell.mjs'
import { useCollectionCardProps } from '../../CollectionCard/CollectionCardHooks.js'
import { BrowserCollectionFilters } from './BrowserCollectionFilters.js'
import type { BrowserCollectionListDataProps } from './BrowserCollectionList.js'
import BrowserCollectionList from './BrowserCollectionList.js'

type CollectionListItem = { _key: string }
type SearchCollectionContextT = {
  sortType: SortType
  setSortType: (sortType: SortType) => void
  collectionList: CollectionListItem[]
  loadMore(): void
}

function reducer(
  prev: CollectionListItem[],
  [action, list]: ['set' | 'more', CollectionListItem[]],
) {
  const keepList = action === 'set' ? [] : prev
  return [...keepList, ...list]
}
export const SearchCollectionContext = createContext<SearchCollectionContextT>(null as any)
export const ProvideSearchCollectionContext: FC<PropsWithChildren> = ({ children }) => {
  const [collectionList, collectionListAction] = useReducer(reducer, [])
  const [collectionSearchResult, setCollectionSearchResult] = useState<CollectionSearchResultRpc>()
  const { q } = useContext(MainSearchBoxCtx)
  const [queryUrlParams, setQueryUrlParams] = useUrlQueryString(['sortType'], shell.pkgId.name)
  const sortType: SortTypeRpc = isSortTypeRpc(queryUrlParams.sortType)
    ? queryUrlParams.sortType
    : 'Popular'

  const load = useCallback(
    async (cursor?: string) => {
      const res = await shell.rpc.me['webapp/search'](null, null, {
        limit: 20,
        sortType,
        text: q,
        after: cursor,
      })
      setCollectionSearchResult(res)
      return res
    },
    [q, sortType],
  )

  useEffect(() => {
    load().then(res => {
      collectionListAction(['set', res.list])
    })
  }, [load])

  const loadMore = useCallback(async () => {
    const res = await load(collectionSearchResult?.endCursor)
    collectionListAction(['more', res.list])
  }, [collectionSearchResult?.endCursor, load])

  const setSortType = useCallback<SearchCollectionContextT['setSortType']>(
    sortType => {
      setQueryUrlParams({ sortType })
    },
    [setQueryUrlParams],
  )
  const ctx: SearchCollectionContextT = { collectionList, loadMore, setSortType, sortType }
  return <SearchCollectionContext.Provider value={ctx}>{children}</SearchCollectionContext.Provider>
}

export const SearchCollectionSectionAddon: PkgAddOns<SearchEntitySectionAddon> = {
  collections: {
    Item: browserMainColumnItemBase => {
      const { collectionList, loadMore } = useContext(SearchCollectionContext)

      const BrowserCollectionListDataProps: BrowserCollectionListDataProps = {
        collectionCardPropsList: collectionList.map(({ _key }) => {
          return {
            key: _key,
            props: proxyWith(function useProxy() {
              return { props: useCollectionCardProps(_key) }
            }),
          }
        }),
        loadMore,
      }

      return (
        <BrowserCollectionList {...BrowserCollectionListDataProps} {...browserMainColumnItemBase} />
      )
    },
    filters: [
      {
        key: 'sort-by',
        Item: () => {
          const { sortType, setSortType } = useContext(SearchCollectionContext)
          return (
            <BrowserCollectionFilters.SortByItem selected={sortType} setSelected={setSortType} />
          )
        },
      },
    ],
    name: 'Collections',
  },
}

export const SearchCollectionWrapperAddon: PkgAddOns<SearchEntityPageWrapper> = {
  default: { Wrapper: ProvideSearchCollectionContext },
}
