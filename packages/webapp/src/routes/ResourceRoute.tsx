import { nodeSlugId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { ctrlHook } from '../ui/lib/ctrl'
import { useResourceCtrl } from '../ui/pages/Resource/Ctrl/ResourcePageCtrl'
import { Resource } from '../ui/pages/Resource/Resource'
import { MNRouteProps, RouteFC } from './lib'

export const ResourceRouteComponent: RouteFC<Routes.ResourcePage> = ({
  match: {
    params: { slug },
  },
}) => {
  const props = ctrlHook(useResourceCtrl, { id: nodeSlugId('Resource', slug) }, `Resource/${slug}`)
  return <Resource {...props} />
}

export const ResourceRoute: MNRouteProps<Routes.ResourcePage> = {
  component: ResourceRouteComponent,
  path: '/resource/:slug',
  exact: true,
}
