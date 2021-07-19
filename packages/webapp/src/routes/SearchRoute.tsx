import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { ctrlHook } from '../ui/lib/ctrl'
import { useSearchCtrl } from '../ui/pages/Search/Ctrl/SearchCtrl'
import { Search } from '../ui/pages/Search/Search'
import { MNRouteProps, RouteFC } from './lib'

export const SearchRouteComponent: RouteFC<Routes.GlobalSearch> = (/* { match } */) => {
  const props = ctrlHook(useSearchCtrl, {})
  return <Search {...props} />
}

export const SearchRoute: MNRouteProps<Routes.GlobalSearch> = {
  component: SearchRouteComponent,
  path: '/search',
  exact: true,
}
