import { NodeType } from '@moodlenet/common/lib/pub-graphql/types.graphql.gen'
import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { uniq } from 'lodash'
import { useMemo } from 'react'
import { GlobalSearchSort } from '../graphql/pub.graphql.link'
import { getUseBaseContentNodeFeedProps } from '../hooks/components/BaseContentNodeFeed'
import { getUsePageHeaderProps } from '../hooks/components/HeaderElement'
import { useGlobalSearch } from '../hooks/glob/useGlobalSearch'
import { UseBaseContentNodeFeedProps } from '../ui/components/BaseContentNodeFeed'
import { GlobalSearchPage, UseGlobalSearchPageProps } from '../ui/pages/GlobalSearchPage'
import { UsePropsList } from '../ui/types'
import { MNRouteProps, RouteFC } from './lib'

export const GlobalSearchRouteComponent: RouteFC<Routes.GlobalSearch> = (/* { match, history } */) => {
  const { items, typeFilters, setTypeFilter, setSortBy, sortBy } = useGlobalSearch()
  const useBaseContentNodeFeedPropsList: UsePropsList<UseBaseContentNodeFeedProps> = items.map(item => [
    getUseBaseContentNodeFeedProps({ id: item._id }),
    item._id,
  ])
  const usePageHeaderProps = getUsePageHeaderProps()

  const useProps = useMemo(
    () => (): UseGlobalSearchPageProps => {
      const _setSortBy: UseGlobalSearchPageProps['setSortBy'] = by => {
        const _sort_by =
          by === 'Pertinence' ? GlobalSearchSort.Pertinence : by === 'Popularity' ? GlobalSearchSort.Popularity : null
        _sort_by && setSortBy(_sort_by)
      }

      const _setTypeFilter: UseGlobalSearchPageProps['setTypeFilter'] = (type, include) => {
        const _add_or_rm_type =
          type === 'Collection'
            ? NodeType.Collection
            : type === 'Resource'
            ? NodeType.Resource
            : type === 'Subject'
            ? NodeType.Subject
            : null
        if (!_add_or_rm_type) {
          return
        }

        setTypeFilter(
          include
            ? uniq([...typeFilters, _add_or_rm_type])
            : typeFilters.filter(present_type => present_type !== _add_or_rm_type),
        )
      }

      return {
        setSortBy: _setSortBy,
        setTypeFilter: _setTypeFilter,
        sortBy,
        typeFilters,
      }
    },
    [setSortBy, setTypeFilter, sortBy, typeFilters],
  )

  return (
    <GlobalSearchPage
      useBaseContentNodeFeedPropsList={useBaseContentNodeFeedPropsList}
      usePageHeaderProps={usePageHeaderProps}
      useProps={useProps}
    />
  )
}

export const GlobalSearchRoute: MNRouteProps<Routes.GlobalSearch> = {
  component: GlobalSearchRouteComponent,
  path: '/search',
  exact: true,
}
