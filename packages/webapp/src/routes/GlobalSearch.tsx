import { contentNodeLink, Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { uniq } from 'lodash'
import { useMemo } from 'react'
import { useGlobalSearch } from '../contexts/Global/GlobalSearch'
import { usePageHeaderProps } from '../hooks/props/PageHeader'
import { BaseContentNodeFeedProps } from '../ui/components/BaseContentNodeFeed'
import { GlobalSearchPage, GlobalSearchPageProps } from '../ui/pages/GlobalSearchPage'
import { getMaybeAssetRefUrl, MNRouteProps, RouteFC } from './lib'

export const GlobalSearchRouteComponent: RouteFC<Routes.GlobalSearch> = (/* { match, history } */) => {
  const { edges, typeFilters, setTypeFilter, setSortBy, sortBy } = useGlobalSearch()

  const baseContentNodeFeedPropsList: BaseContentNodeFeedProps[] = edges
    .map(edge => edge.node)
    .map(node => ({
      icon: getMaybeAssetRefUrl(node.icon),
      link: contentNodeLink(node),
      name: node.name,
      summary: node.summary,
      type: node.__typename,
      followers: node.followersCount,
      likers: node.likersCount,
    }))
  const pageHeaderProps = usePageHeaderProps()

  const globalSearchPageProps = useMemo<GlobalSearchPageProps>(() => {
    const downstream_setSortBy: GlobalSearchPageProps['setSortBy'] = by => {
      const _sort_by = by === 'Relevance' ? 'Relevance' : by === 'Popularity' ? 'Popularity' : null
      _sort_by && setSortBy(_sort_by)
    }

    const toggleTypeFilter: GlobalSearchPageProps['toggleTypeFilter'] = type => {
      setTypeFilter(
        typeFilters.includes(type)
          ? typeFilters.filter(present_type => present_type !== type)
          : uniq([...typeFilters, type]),
      )
    }

    return {
      setSortBy: downstream_setSortBy,
      toggleTypeFilter,
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
