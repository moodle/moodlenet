import { EdgeType, NodeType } from '@moodlenet/common/lib/pub-graphql/types.graphql.gen'
import { contentNodeLink, Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { uniq } from 'lodash'
import { useMemo } from 'react'
import { useGlobalSearch } from '../contexts/Global/GlobalSearch'
import { GlobalSearchSort } from '../graphql/pub.graphql.link'
import { getRelCount } from '../helpers/nodeMeta'
import { usePageHeaderProps } from '../hooks/props/PageHeader'
import { BaseContentNodeFeedProps } from '../ui/components/BaseContentNodeFeed'
import { GlobalSearchPage, GlobalSearchPageProps } from '../ui/pages/GlobalSearchPage'
import { MNRouteProps, RouteFC } from './lib'

export const GlobalSearchRouteComponent: RouteFC<Routes.GlobalSearch> = (/* { match, history } */) => {
  const glob = useGlobalSearch()
  const { items, typeFilters, setTypeFilter, setSortBy, sortBy } = glob

  const baseContentNodeFeedPropsList: BaseContentNodeFeedProps[] = items.map(item => ({
    icon: item.icon ?? null,
    link: contentNodeLink(item),
    name: item.name,
    summary: item.summary,
    type: item.__typename,
    followers: getRelCount(item._meta, EdgeType.Follows, 'from', NodeType.Profile),
    likers: getRelCount(item._meta, EdgeType.Likes, 'from', NodeType.Profile),
  }))
  const pageHeaderProps = usePageHeaderProps()

  const globalSearchPageProps = useMemo<GlobalSearchPageProps>(() => {
    const _setSortBy: GlobalSearchPageProps['setSortBy'] = by => {
      const _sort_by =
        by === 'Relevance' ? GlobalSearchSort.Relevance : by === 'Popularity' ? GlobalSearchSort.Popularity : null
      _sort_by && setSortBy(_sort_by)
    }

    const _setTypeFilter: GlobalSearchPageProps['setTypeFilter'] = (type, include) => {
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
      baseContentNodeFeedPropsList,
      pageHeaderProps,
    }
  }, [baseContentNodeFeedPropsList, pageHeaderProps, setSortBy, setTypeFilter, sortBy, typeFilters])

  return <GlobalSearchPage {...globalSearchPageProps} />
}

export const GlobalSearchRoute: MNRouteProps<Routes.GlobalSearch> = {
  component: GlobalSearchRouteComponent,
  path: '/search',
  exact: true,
}
