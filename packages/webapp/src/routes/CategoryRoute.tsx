import { nodeSlugId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { getContentNodeHomePageRoutePath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { ctrlHook } from '../ui/lib/ctrl'
import { Category } from '../ui/pages/Category/Category'
import { useCategoryCtrl } from '../ui/pages/Category/Ctrl/CategoryPageCtrl'
import { MNRouteProps, RouteFC } from './lib'

export const CategoryRouteComponent: RouteFC<Routes.ContentNodeHomePage> = ({
  match: {
    params: { slug },
  },
}) => {
  const id = nodeSlugId('IscedField', slug)
  const props = ctrlHook(useCategoryCtrl, { id }, `route-${id}`)
  return <Category {...props} />
}

export const CategoryRoute: MNRouteProps<Routes.ContentNodeHomePage> = {
  component: CategoryRouteComponent,
  path: getContentNodeHomePageRoutePath('IscedField'),
  exact: true,
}
