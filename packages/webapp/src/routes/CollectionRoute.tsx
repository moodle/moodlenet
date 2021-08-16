import { nodeSlugId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { ctrlHook } from '../ui/lib/ctrl'
import { Collection } from '../ui/pages/Collection/Collection'
import { useCollectionCtrl } from '../ui/pages/Collection/Ctrl/CollectionPageCtrl'
import { MNRouteProps, RouteFC } from './lib'

export const CollectionRouteComponent: RouteFC<Routes.CollectionPage> = ({
  match: {
    params: { slug },
  },
}) => {
  const props = ctrlHook(useCollectionCtrl, { id: nodeSlugId('Collection', slug) }, `Collection/${slug}`)
  return <Collection {...props} />
}

export const CollectionRoute: MNRouteProps<Routes.CollectionPage> = {
  component: CollectionRouteComponent,
  path: '/collection/:slug',
  exact: true,
}
