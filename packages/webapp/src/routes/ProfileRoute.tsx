import { nodeSlugId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { ctrlHook } from '../ui/lib/ctrl'
import { useProfileCtrl } from '../ui/pages/Profile/Ctrl/ProfileCtrl'
import { Profile } from '../ui/pages/Profile/Profile'
import { MNRouteProps, RouteFC } from './lib'

export const ProfileRouteComponent: RouteFC<Routes.Profile> = ({
  match: {
    params: { slug },
  },
}) => {
  const props = ctrlHook(useProfileCtrl, { id: nodeSlugId('Profile', slug) }, `Profile/${slug}`)
  return <Profile {...props} />
}

export const ProfileRoute: MNRouteProps<Routes.Profile> = {
  component: ProfileRouteComponent,
  path: '/profile/:slug',
  exact: true,
}
