import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { usePageHeaderProps } from '../hooks/props/PageHeader'
import { HomePage } from '../ui/pages/Home'
import { MNRouteProps, RouteFC } from './lib'

export const HomeRouteComponent: RouteFC<Routes.Home> = (/* { match } */) => {
  const pageHeaderProps = usePageHeaderProps()
  return <HomePage pageHeaderProps={pageHeaderProps} />
}

export const HomeRoute: MNRouteProps<Routes.Home> = {
  component: HomeRouteComponent,
  path: '/',
  exact: true,
}
