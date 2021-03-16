import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router'
import { useGlobalSearchLazyQuery } from './useGlobalSearch/globalSearch.gen'

export const useUrlQuery = () => new URLSearchParams(useLocation().search)
export const useGlobalSearch = () => {
  const urlQuery = useUrlQuery()
  const qs = useMemo(() => urlQuery.get('q') ?? '', [urlQuery])
  const _state = useState(qs)
  const [searchText, setSearchText] = _state
  useEffect(() => setSearchText(qs), [qs, setSearchText])

  const [query, res] = useGlobalSearchLazyQuery()
  useEffect(() => {
    let i: any = null
    if (searchText) {
      i = setTimeout(() => {
        query({ variables: { text: searchText } })
      }, 500)
    }
    return () => clearTimeout(i)
  }, [query, searchText])
  const items = useMemo(() => res.data?.globalSearch.edges.map(edge => edge.node) || [], [res.data?.globalSearch.edges])
  return useMemo(
    () => ({
      items,
      searchText,
      setSearchText,
    }),
    [items, searchText, setSearchText],
  )
}
