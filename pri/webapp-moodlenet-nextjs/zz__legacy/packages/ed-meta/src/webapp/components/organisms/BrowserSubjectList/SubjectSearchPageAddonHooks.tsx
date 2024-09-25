import type { AddOnMap } from '@moodlenet/core/lib'
import { MainSearchBoxCtx, proxyWith, type SortType } from '@moodlenet/react-app/ui'
import {
  silentCatchAbort,
  useUrlQueryString,
  type SearchEntityPageWrapper,
  type SearchEntitySectionAddon,
} from '@moodlenet/react-app/webapp'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react'
import type { SortTypeRpc, SubjectSearchResultRpc } from '../../../../common/types.mjs'
import { isSortTypeRpc } from '../../../../common/types.mjs'
import { shell } from '../../../rt/shell.mjs'

import { useSubjectCardProps } from '../SubjectCard/SubjectCardHooks'
import type { BrowserSubjectListDataProps } from './BrowserSubjectList'
import BrowserSubjectList from './BrowserSubjectList'
import { BrowserSubjectFilters } from './BrowserSubjectListFilters'

type SubjectListItem = { _key: string }
type SearchSubjectContextT = {
  sortType: SortType
  setSortType: (sortType: SortType) => void
  subjectList: SubjectListItem[]
  loadMore(): void
}

function reducer(prev: SubjectListItem[], [action, list]: ['set' | 'more', SubjectListItem[]]) {
  const keepList = action === 'set' ? [] : prev
  return [...keepList, ...list]
}
export const SearchSubjectContext = createContext<SearchSubjectContextT>(null as any)
export const ProvideSearchSubjectContext: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [subjectList, subjectListAction] = useReducer(reducer, [])
  const [subjectSearchResult, setSubjectSearchResult] = useState<SubjectSearchResultRpc>()
  const { qText: q } = useContext(MainSearchBoxCtx)
  const [queryUrlParams, setQueryUrlParams] = useUrlQueryString(['sortType'], shell.pkgId.name)
  const sortType: SortTypeRpc = isSortTypeRpc(queryUrlParams.sortType)
    ? queryUrlParams.sortType
    : 'Popular'

  const load = useCallback(
    (limit: number, cursor?: string) => {
      return shell.rpc
        .me('webapp/search', { rpcId: 'search' })(null, null, {
          limit,
          sortType,
          text: q,
          after: cursor,
        })
        .then(res => {
          setSubjectSearchResult(res)
          return res
        })
        .catch(silentCatchAbort)
    },
    [q, sortType],
  )

  useEffect(() => {
    load(10).then(res => {
      res && subjectListAction(['set', res.list])
    })
  }, [load])

  const hasNoMore = !!subjectSearchResult && !subjectSearchResult.endCursor
  const loadMore = useCallback(async () => {
    if (hasNoMore) {
      return
    }
    const res = await load(30, subjectSearchResult?.endCursor)
    res && subjectListAction(['more', res.list])
  }, [hasNoMore, load, subjectSearchResult?.endCursor])

  const setSortType = useCallback<SearchSubjectContextT['setSortType']>(
    sortType => {
      setQueryUrlParams({ sortType })
    },
    [setQueryUrlParams],
  )
  const ctx: SearchSubjectContextT = { subjectList, loadMore, setSortType, sortType }
  return <SearchSubjectContext.Provider value={ctx}>{children}</SearchSubjectContext.Provider>
}

export const SearchSubjectSectionAddon: AddOnMap<SearchEntitySectionAddon> = {
  subjects: {
    position: 3,
    Item: browserMainColumnItemBase => {
      const { subjectList, loadMore } = useContext(SearchSubjectContext)

      const BrowserSubjectListDataProps: BrowserSubjectListDataProps = {
        subjectCardPropsList: subjectList.map(({ _key }) => {
          return {
            key: _key,
            props: proxyWith(function useProxy() {
              return { props: useSubjectCardProps(_key) }
            }),
          }
        }),
        loadMore,
      }

      return <BrowserSubjectList {...BrowserSubjectListDataProps} {...browserMainColumnItemBase} />
    },
    filters: [
      {
        key: 'sort-by',
        Item: () => {
          const { sortType, setSortType } = useContext(SearchSubjectContext)
          return <BrowserSubjectFilters.SortByItem selected={sortType} setSelection={setSortType} />
        },
      },
    ],
    name: 'Subjects',
  },
}

export const SearchSubjectWrapperAddon: AddOnMap<SearchEntityPageWrapper> = {
  default: { Wrapper: ProvideSearchSubjectContext },
}
