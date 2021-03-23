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

  const qs = useMemo(() => urlQuery.get('q') ?? '', [urlQuery])

  const [searchText, setSearchText] = useState(qs)
  const [sortBy, setSortBy] = useState<GlobalSearchSort>(GlobalSearchSort.Relevance)
  const [typeFilters, setTypeFilter] = useState<NodeTypeFilter[]>([])

  useEffect(() => setSearchText(qs), [qs, setSearchText])

  useEffect(() => {
    if (!searchText) {
      firstIn = true
      return
    }
    const toId = setTimeout(() => {
      history[firstIn ? 'push' : 'replace'](`${mainPath.search}?q=${searchText}`)
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
