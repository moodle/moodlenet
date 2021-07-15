import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { searchWithProps } from '../ui/pages/Search/Ctrl/SearchCtrl'
import { Search } from '../ui/pages/Search/Search'
import { MNRouteProps, RouteFC } from './lib'

export const SearchRouteComponent: RouteFC<Routes.GlobalSearch> = (/* { match } */) => {
  const [SearchCtrl, searchProps] = searchWithProps({ key: `Search Page` })(Search)

  return <SearchCtrl {...searchProps} />
}

export const SearchRoute: MNRouteProps<Routes.GlobalSearch> = {
  component: SearchRouteComponent,
  path: '/search',
  exact: true,
}
