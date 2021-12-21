import { isGlobalSearchSortBy } from '@moodlenet/common/dist/content-graph/types/global-search'
import {
  GlobalSearchSort,
  Maybe,
} from '@moodlenet/common/dist/graphql/types.graphql.gen'
import { useCallback, useMemo } from 'react'
import { mainPath } from '../../../../../hooks/glob/nav'
import { useUrlQuery } from '../../../../lib/useUrlQuery'

const paramNames = ['text', 'sortBy', 'sortDir'] as const
export const useSearchUrlQuery = () => {
  const { queryParams, setQueryParams, queryParamsArray } = useUrlQuery(
    paramNames,
    {
      baseUrl: mainPath.search,
    }
  )
  const sort = useMemo<Maybe<GlobalSearchSort>>(() => {
    if (!isGlobalSearchSortBy(queryParams.sortBy)) {
      return null
    }
    return {
      by: queryParams.sortBy,
      asc: queryParams.sortDir === 'asc',
    }
  }, [queryParams.sortBy, queryParams.sortDir])

  const setText = useCallback(
    (text: string) => setQueryParams({ text: [text] }),
    [setQueryParams]
  )
  const setSort = useCallback(
    ({ by, asc }: GlobalSearchSort) =>
      setQueryParams({ sortBy: [by], sortDir: [asc ? 'asc' : 'desc'] }),
    [setQueryParams]
  )

  const text = useMemo(
    () => queryParamsArray.text.join(' '),
    [queryParamsArray]
  )
  return {
    paramNames,
    setText,
    text,
    sort,
    setSort,
  }
}
