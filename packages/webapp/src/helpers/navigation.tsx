import { GetRouteDefParams, GetRouteDefPath, RouteDef, webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { LinkDef } from '../ui/context'

export const NeverPage = (_: never) => {
  ///FIXME: use a UI Page
  return <div>Not Found</div>
}

export const webappLinkDef = <Route extends RouteDef<string, any>>(
  path: GetRouteDefPath<Route>,
  params: GetRouteDefParams<Route>,
): LinkDef => {
  const pathLink = webappPath<Route>(path, params)
  return {
    dest: pathLink,
    external: false,
  }
}
