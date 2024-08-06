import { Routes } from '@moodlenet/common/dist/webapp/sitemap'
import { useSearchCtrl } from '../ui/components/pages/Search/Ctrl/SearchCtrl'
import { Search } from '../ui/components/pages/Search/Search'
import { ctrlHook } from '../ui/lib/ctrl'
import { MNRouteProps, RouteFC } from './lib'

export const SearchRouteComponent: RouteFC<
  Routes.GlobalSearch
> = (/* { match } */) => {
  const props = ctrlHook(useSearchCtrl, {}, 'search-route')
  return <Search {...props} />
}

export const SearchRoute: MNRouteProps<Routes.GlobalSearch> = {
  component: SearchRouteComponent,
  path: '/search',
  exact: true,
}
