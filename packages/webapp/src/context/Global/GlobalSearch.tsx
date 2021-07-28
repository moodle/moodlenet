import { GlobalSearchSort } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { isGlobalSearchSort } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { createContext, FC, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { mainPath } from '../../hooks/glob/nav'
import { GlobalSearchEdgeFragment, useGlobalSearchLazyQuery } from './GlobalSearch/globalSearch.gen'

type NodeTypeFilter = 'Resource' | 'Collection' | 'Iscedf'
const nodeTypeFilters: NodeTypeFilter[] = ['Resource', 'Collection', 'Iscedf']
const isNodeTypeFilter = (_: any): _ is NodeTypeFilter => !!_ && nodeTypeFilters.includes(_)
export const useUrlQuery = () => {
  const search = useLocation().search
  return useMemo(() => new URLSearchParams(search), [search])
}

type GlobalSearchCtx = {
  searchText: string
  setSearchText(searchText: string): void
  setSortBy(sortBy: GlobalSearchSort): void
  sortBy: GlobalSearchSort
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
    const sort = urlQuery.get('sort') ?? ''
    const filter = (urlQuery.get('filter') ?? '').split(',').filter(isNodeTypeFilter)

    return {
      q,
      filter,
      sort: isGlobalSearchSort(sort) ? sort : 'Relevance',
    }
  }, [urlQuery])

  const [searchText, setSearchText] = useState(initialParams.q)
  const [sortBy, setSortBy] = useState<GlobalSearchSort>(initialParams.sort)
  const [typeFilters, setTypeFilter] = useState<NodeTypeFilter[]>(initialParams.filter)

  useEffect(() => {
    if (!searchText) {
      firstIn.current = true
      return
    }
    const toId = setTimeout(() => {
      let params = new URLSearchParams()

      params.append('q', searchText)
      params.append('sort', sortBy)
      params.append('filter', typeFilters.join(','))

      history[firstIn.current ? 'push' : 'replace'](`${mainPath.search}?${params.toString()}`)
      firstIn.current = false
      query({ variables: { text: searchText, sortBy, nodeTypes: typeFilters } })
    }, 500)
    return () => clearTimeout(toId)
  }, [typeFilters, query, searchText, sortBy, history])
  const globSearch = useMemo<GlobalSearchCtx>(
    () => ({
      edges: res.data?.globalSearch.edges ?? [],
      searchText,
      setSearchText,
      setSortBy,
      sortBy,
      typeFilters,
      setTypeFilter,
    }),
    [searchText, res, sortBy, typeFilters],
  )

  return <GlobalSearchContext.Provider value={globSearch}>{children}</GlobalSearchContext.Provider>
}
