import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { getUseBaseContentNodeFeedProps } from '../hooks/components/BaseContentNodeFeed'
import { getUsePageHeaderProps } from '../hooks/components/HeaderElement'
import { useGlobalSearch } from '../hooks/glob/useGlobalSearch'
import { UseBaseContentNodeFeedProps } from '../ui/components/BaseContentNodeFeed'
import { GlobalSearchPage } from '../ui/pages/GlobalSearchPage'
import { UsePropsList } from '../ui/types'
import { MNRouteProps, RouteFC } from './lib'

export const GlobalSearchRouteComponent: RouteFC<Routes.GlobalSearch> = (/* { match, history } */) => {
  const { items } = useGlobalSearch()
  const useBaseContentNodeFeedPropsList: UsePropsList<UseBaseContentNodeFeedProps> = items.map(item => [
    getUseBaseContentNodeFeedProps({ id: item._id }),
    item._id,
  ])
  const usePageHeaderProps = getUsePageHeaderProps()
  return (
    <GlobalSearchPage
      useBaseContentNodeFeedPropsList={useBaseContentNodeFeedPropsList}
      usePageHeaderProps={usePageHeaderProps}
    />
  )
}

export const GlobalSearchRoute: MNRouteProps<Routes.GlobalSearch> = {
  component: GlobalSearchRouteComponent,
  path: '/search',
  exact: true,
}
