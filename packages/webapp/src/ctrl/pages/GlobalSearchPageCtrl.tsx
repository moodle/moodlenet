import { FC, useEffect, useMemo } from 'react'
import { useGlobalSearchText } from '../../contexts/Global/Router'
import { GlobalSearchPage } from '../../ui/pages/GlobalSearchPage'
import { useGlobalSearchLazyQuery } from './GlobalSearchPageCtrl/globalSearch.gen'

export type GlobalSearchPageCtrlProps = {}
export const GlobalSearchPageCtrl: FC<GlobalSearchPageCtrlProps> = (/* { q } */) => {
  const [searchText] = useGlobalSearchText()
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
  return <GlobalSearchPage items={items} />
}
