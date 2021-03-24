import { GlobalSearchSort, NodeType } from '@moodlenet/common/lib/pub-graphql/types.graphql.gen'
import { createContext, FC, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { mainPath } from '../../hooks/glob/nav'
import { useGlobalSearchLazyQuery } from './GlobalSearch/globalSearch.gen'

type NodeTypeFilter = NodeType.Resource | NodeType.Collection | NodeType.Subject
export const useUrlQuery = () => {
  const search = useLocation().search
  return useMemo(() => new URLSearchParams(search), [search])
}

type GlobalSearchCtx = ReturnType<typeof _useGlobalSearch>
export const GlobalSearchContext = createContext<GlobalSearchCtx>(null as any)
export const useGlobalSearch = () => useContext(GlobalSearchContext)

export const GlobalSearchProvider: FC = ({ children }) => {
  const ctx = _useGlobalSearch()
  return <GlobalSearchContext.Provider value={ctx}>{children}</GlobalSearchContext.Provider>
}

export const _useGlobalSearch = () => {
  const firstIn = useRef(true)

  const [query, res] = useGlobalSearchLazyQuery()
  const urlQuery = useUrlQuery()
  const history = useHistory()

  const initialParams = useMemo(() => {
    const q = urlQuery.get('q') ?? ''
    const sort = urlQuery.get('sort') ?? ''
    const filter = (urlQuery.get('filter') ?? '')
      .split(',')
      .filter(
        (_): _ is NodeTypeFilter => _ === NodeType.Resource || _ === NodeType.Collection || _ === NodeType.Subject,
      )

    return {
      q,
      filter,
      sort:
        sort === GlobalSearchSort.Popularity || sort === GlobalSearchSort.Relevance ? sort : GlobalSearchSort.Relevance,
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

      //Add a second foo parameter.
      params.append('q', searchText)
      params.append('sort', sortBy)
      params.append('filter', typeFilters.join(','))

      history[firstIn.current ? 'push' : 'replace'](`${mainPath.search}?${params.toString()}`)
      firstIn.current = false
      query({ variables: { text: searchText, sortBy, nodeTypes: typeFilters } })
    }, 500)
    return () => clearTimeout(toId)
  }, [typeFilters, query, searchText, sortBy, history])
  const globSearch = useMemo(
    () => ({
      items: (searchText && res.data?.globalSearch.edges.map(edge => edge.node)) || [],
      searchText,
      setSearchText,
      setSortBy,
      sortBy,
      typeFilters,
      setTypeFilter,
    }),
    [searchText, res, sortBy, typeFilters],
  )
  return globSearch
}
