// import { isGlobalSearchSortBy } from '@moodlenet/common/dist/content-graph/types/global-search'
// import {
//   GlobalSearchSort,
//   Maybe,
// } from '@moodlenet/common/dist/graphql/types.graphql.gen'
// import { useCallback, useMemo } from 'react'
// import { mainPath } from '../../../../../hooks/glob/nav'
// import { useUrlQuery } from '../../../../lib/useUrlQuery'
// import { FilterType, filterTypes } from '../../../organisms/Browser/Browser'

// const browserParamNames = ['text', 'sortBy', 'sortDir', 'hideTypes'] as const
// export const useBrowserUrlQuery = () => {
//   const { queryParams, setQueryParams, queryParamsArray } = useUrlQuery(
//     browserParamNames,
//     {
//       baseUrl: mainPath.search,
//     }
//   )
//   const sort = useMemo<Maybe<GlobalSearchSort>>(() => {
//     if (!isGlobalSearchSortBy(queryParams.sortBy)) {
//       return null
//     }
//     return {
//       by: queryParams.sortBy,
//       asc: queryParams.sortDir === 'asc',
//     }
//   }, [queryParams.sortBy, queryParams.sortDir])

//   const setSort = useCallback(
//     ({ by, asc }: GlobalSearchSort) =>
//       setQueryParams({ sortBy: [by], sortDir: [asc ? 'asc' : 'desc'] }),
//     [setQueryParams]
//   )

//   const filters = useMemo<Record<FilterType, boolean>>(() => {
//     const hideTypes = queryParamsArray.hideTypes
//     // .filter<FilterType>((_): _ is FilterType =>
//     //   filterTypes.includes(_ as any)
//     // )
//     return {
//       Collections: !hideTypes.includes('Collections'),
//       Resources: !hideTypes.includes('Resources'),
//       People: !hideTypes.includes('People'),
//       Subjects: !hideTypes.includes('Subjects'),
//     }
//   }, [queryParamsArray.hideTypes])

//   const setFilters = useCallback(
//     (filters: Record<FilterType, boolean>) => {
//       const showTypesArr = Object.entries(filters).reduce(
//         (_filters, [type, show]) =>
//           show ? [..._filters, type as FilterType] : _filters,
//         [] as FilterType[]
//       )
//       const hideTypesArr = filterTypes.filter((_) => !showTypesArr.includes(_))
//       setQueryParams({ hideTypes: hideTypesArr })
//     },
//     [setQueryParams]
//   )

//   const setText = useCallback(
//     (text: string) => setQueryParams({ text: [text] }),
//     [setQueryParams]
//   )

//   const text = useMemo(
//     () => queryParamsArray.text.join(' '),
//     [queryParamsArray]
//   )

//   return {
//     browserParamNames,
//     setText,
//     text,
//     filters,
//     setFilters,
//     sort,
//     setSort,
//   }
// }
