import { GlobalSearchSort, isGlobalSearchSortBy } from '@moodlenet/common/lib/content-graph/types/global-search'
import { createContext, FC, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { mainPath } from '../../hooks/glob/nav'
import { GlobalSearchEdgeFragment, useGlobalSearchLazyQuery } from './GlobalSearch/globalSearch.gen'

type NodeTypeFilter = 'Resource' | 'Collection' | 'IscedField'
const nodeTypeFilters: NodeTypeFilter[] = ['Resource', 'Collection', 'IscedField']
const isNodeTypeFilter = (_: any): _ is NodeTypeFilter => !!_ && nodeTypeFilters.includes(_)
export const useUrlQuery = () => {
  const search = useLocation().search
  return useMemo(() => new URLSearchParams(search), [search])
}

type GlobalSearchCtx = {
  searchText: string
  setSearchText(searchText: string): void
  setSort(sort: GlobalSearchSort): void
  sort: GlobalSearchSort
  typeFilters: NodeTypeFilter[]
  setTypeFilter(nodeTypeFilters: NodeTypeFilter[]): void
  edges: GlobalSearchEdgeFragment[]
}

export const GlobalSearchContext = createContext<GlobalSearchCtx>(null as any)
export const useGlobalSearch = () => useContext(GlobalSearchContext)

export const GlobalSearchProvider: FC = ({ children }) => {
  const firstIn = useRef(true)

  const [query, res] = useGlobalSearchLazyQuery()
  const urlQuery = useUrlQuery()
  const history = useHistory()

  const initialParams = useMemo(() => {
    const q = urlQuery.get('q') ?? ''
    const sortBy = urlQuery.get('sort-by') ?? ''
    const asc = urlQuery.get('sort-asc') ?? ''
    const filter = (urlQuery.get('filter') ?? '').split(',').filter(isNodeTypeFilter)

    return {
      q,
      filter,
      sortby: isGlobalSearchSortBy(sortBy) ? sortBy : 'Relevance',
      asc: asc ? true : false,
    }
  }, [urlQuery])

  const [searchText, setSearchText] = useState(initialParams.q)
  const [sort, setSort] = useState<GlobalSearchSort>({ by: initialParams.sortby, asc: initialParams.asc })
  const [typeFilters, setTypeFilter] = useState<NodeTypeFilter[]>(initialParams.filter)

  useEffect(() => {
    if (!searchText) {
      firstIn.current = true
      return
    }
    const toId = setTimeout(() => {
      let params = new URLSearchParams()

      params.append('q', searchText)
      params.append('sort-by', sort.by)
      sort.asc && params.append('sort-asc', '')
      params.append('filter', typeFilters.join(','))

      history[firstIn.current ? 'push' : 'replace'](`${mainPath.search}?${params.toString()}`)
      firstIn.current = false
      query({ variables: { text: searchText, sort, nodeTypes: typeFilters } })
    }, 500)
    return () => clearTimeout(toId)
  }, [typeFilters, query, searchText, sort, history])
  const globSearch = useMemo<GlobalSearchCtx>(
    () => ({
      edges: res.data?.globalSearch.edges ?? [],
      searchText,
      setSearchText,
      setSort,
      sort,
      typeFilters,
      setTypeFilter,
    }),
    [searchText, res, sort, typeFilters],
  )

  return <GlobalSearchContext.Provider value={globSearch}>{children}</GlobalSearchContext.Provider>
}
