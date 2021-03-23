import { GlobalSearchSort, NodeType } from '@moodlenet/common/lib/pub-graphql/types.graphql.gen'
import { useEffect, useMemo, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { mainPath } from '../glob/nav'
import { useGlobalSearchLazyQuery } from './useGlobalSearch/globalSearch.gen'

let firstIn = true
type NodeTypeFilter = NodeType.Resource | NodeType.Collection | NodeType.Subject
export const useUrlQuery = () => new URLSearchParams(useLocation().search)
export const useGlobalSearch = () => {
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
      firstIn = true
      return
    }
    const toId = setTimeout(() => {
      let params = new URLSearchParams()

      //Add a second foo parameter.
      params.append('q', searchText)
      params.append('sort', sortBy)
      params.append('filter', typeFilters.join(','))

      history[firstIn ? 'push' : 'replace'](`${mainPath.search}?${params.toString()}`)
      firstIn = false
      console.log(`query`, { searchText, sortBy, typeFilters })
      query({ variables: { text: searchText, sortBy, nodeTypes: typeFilters } })
    }, 500)
    return () => clearTimeout(toId)
  }, [typeFilters, query, searchText, sortBy, history])

  const items = useMemo(() => res.data?.globalSearch.edges.map(edge => edge.node) || [], [res.data?.globalSearch.edges])

  return useMemo(
    () => ({
      items,
      searchText,
      setSearchText,
      setSortBy,
      sortBy,
      typeFilters,
      setTypeFilter,
    }),
    [items, typeFilters, searchText, sortBy],
  )
}
