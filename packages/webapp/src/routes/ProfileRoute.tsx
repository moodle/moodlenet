import { glyphId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { profileWithProps } from '../ui/pages/Profile/Ctrl/ProfileCtrl'
import { Profile } from '../ui/pages/Profile/Profile'
import { MNRouteProps, RouteFC } from './lib'

export const ProfileRouteComponent: RouteFC<Routes.Profile> = ({
  match: {
    params: { id },
  },
}) => {
  const [ProfileCtrl, profileProps] = profileWithProps({ id: glyphId('Profile', id), key: `Profile Page` })(Profile)
  return <ProfileCtrl {...profileProps} />
}

export const ProfileRoute: MNRouteProps<Routes.Profile> = {
  component: ProfileRouteComponent,
  path: '/profile/:id',
  exact: true,
}
