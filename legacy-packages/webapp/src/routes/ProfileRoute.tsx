import { nodeSlugId } from '@moodlenet/common/dist/utils/content-graph/id-key-type-guards'
import { Routes } from '@moodlenet/common/dist/webapp/sitemap'
import { getContentNodeHomePageRoutePath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { useProfileCtrl } from '../ui/components/pages/Profile/Ctrl/ProfileCtrl'
import { Profile } from '../ui/components/pages/Profile/Profile'
import { ctrlHook } from '../ui/lib/ctrl'
import { MNRouteProps, RouteFC } from './lib'

export const ProfileRouteComponent: RouteFC<Routes.ContentNodeHomePage> = ({
  match: {
    params: { slug },
  },
}) => {
  const id = nodeSlugId('Profile', slug)
  const props = ctrlHook(useProfileCtrl, { id }, `route-${id}`)
  return <Profile {...props} />
}

export const ProfileRoute: MNRouteProps<Routes.ContentNodeHomePage> = {
  component: ProfileRouteComponent,
  path: getContentNodeHomePageRoutePath('Profile'),
  exact: true,
}
