import { nodeSlugId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { getContentNodeHomePageRoutePath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { Collection } from '../ui/components/pages/Collection/Collection'
import { useCollectionCtrl } from '../ui/components/pages/Collection/Ctrl/CollectionPageCtrl'
import { ctrlHook } from '../ui/lib/ctrl'
import { MNRouteProps, RouteFC } from './lib'

export const CollectionRouteComponent: RouteFC<Routes.ContentNodeHomePage> = ({
  match: {
    params: { slug },
  },
}) => {
  const id = nodeSlugId('Collection', slug)
  const props = ctrlHook(useCollectionCtrl, { id }, `route-${id}`)
  return <Collection {...props} />
}

export const CollectionRoute: MNRouteProps<Routes.ContentNodeHomePage> = {
  component: CollectionRouteComponent,
  path: getContentNodeHomePageRoutePath('Collection'),
  exact: true,
}
