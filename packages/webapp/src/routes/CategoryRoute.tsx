import { nodeSlugId } from '@moodlenet/common/dist/utils/content-graph/id-key-type-guards'
import { Routes } from '@moodlenet/common/dist/webapp/sitemap'
import { getContentNodeHomePageRoutePath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { Category } from '../ui/components/pages/Category/Category'
import { useCategoryCtrl } from '../ui/components/pages/Category/Ctrl/CategoryPageCtrl'
import { ctrlHook } from '../ui/lib/ctrl'
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
