import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { getUsePageHeaderProps } from '../hooks/components/HeaderElement'
import { HomePage } from '../ui/pages/Home'
import { MNRouteProps, RouteFC } from './lib'

export const HomeRouteComponent: RouteFC<Routes.Home> = (/* { match } */) => {
  const usePageHeaderProps = getUsePageHeaderProps()
  return <HomePage usePageHeaderProps={usePageHeaderProps} />
}

export const HomeRoute: MNRouteProps<Routes.Home> = {
  component: HomeRouteComponent,
  path: '/',
  exact: true,
}
