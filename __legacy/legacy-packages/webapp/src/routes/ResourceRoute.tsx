import { nodeSlugId } from '@moodlenet/common/dist/utils/content-graph/id-key-type-guards'
import { Routes } from '@moodlenet/common/dist/webapp/sitemap'
import { getContentNodeHomePageRoutePath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { useResourceCtrl } from '../ui/components/pages/Resource/Ctrl/ResourcePageCtrl'
import { Resource } from '../ui/components/pages/Resource/Resource'
import { ctrlHook } from '../ui/lib/ctrl'
import { MNRouteProps, RouteFC } from './lib'

export const ResourceRouteComponent: RouteFC<Routes.ContentNodeHomePage> = ({
  match: {
    params: { slug },
  },
}) => {
  const id = nodeSlugId('Resource', slug)
  const props = ctrlHook(useResourceCtrl, { id }, `route-${id}`)
  return <Resource {...props} />
}

export const ResourceRoute: MNRouteProps<Routes.ContentNodeHomePage> = {
  component: ResourceRouteComponent,
  path: getContentNodeHomePageRoutePath('Resource'),
  exact: true,
}
