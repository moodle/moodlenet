import { AddonItem } from '@moodlenet/component-library'
import { href } from '@moodlenet/react-app/common'
import { linkTo } from '@storybook/addon-links'
import { AvatarMenu, AvatarMenuItem } from './AvatarMenu.js'
import {
  ProfileLinkAvatarMenuComponent,
  SignoutAvatarMenuComponent,
} from './webUserAvatarMenuComponents.js'

const avatarPicture =
  'https://images.pexels.com/photos/3746326/pexels-photo-3746326.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200'

export const AvatarMenuHeaderItem: AddonItem = {
  Item: () => (
    <AvatarMenu
      avatarUrl={avatarPicture}
      menuItems={[AvatarMenuProfileItem, AvatarMenuSignoutItem]}
    />
  ),
  key: 'avatar-menu',
}

export const AvatarMenuProfileItem: AvatarMenuItem = {
  Component: () => (
    <ProfileLinkAvatarMenuComponent
      avatarUrl={avatarPicture}
      profileHref={href('Pages/Profile/Logged In')}
    />
  ),
  key: 'profile',
}
export const AvatarMenuSignoutItem: AvatarMenuItem = {
  Component: () => <SignoutAvatarMenuComponent signout={linkTo('Pages/Landing', 'Logged In')} />,
  key: 'signout',
}
