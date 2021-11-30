import { usePagination } from '../../../hooks/usePagination'
import { GlobalSearchQueryResult } from './globalSearch.gen'

export const usePaginateSearch = (
  globalSearchQueryResult: GlobalSearchQueryResult
) => {
  const { data, variables, fetchMore } = globalSearchQueryResult
  return usePagination(data?.globalSearch, ({ cursor, update }) => {
    return fetchMore({
      variables: { page: { ...variables?.page, ...cursor } },
      updateQuery: (prev, { fetchMoreResult }) => {
        return fetchMoreResult?.globalSearch && prev.globalSearch
          ? {
              ...fetchMoreResult,
              globalSearch: update({
                prev: prev.globalSearch,
                fetched: fetchMoreResult.globalSearch,
              }),
            }
          : prev
      },
    })
  })
}
