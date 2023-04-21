import { AddonItem } from '@moodlenet/component-library'
import { href } from '@moodlenet/react-app/common'
import { HeaderMenuItem } from '@moodlenet/react-app/ui'
import { AvatarMenu } from './AvatarMenu.js'
import {
  HeaderProfileIcon,
  profileAvatarmenuItemReg,
  signoutAvatarmenuItemReg,
} from './HeaderProfile.js'

const avatarPicture =
  'https://images.pexels.com/photos/3746326/pexels-photo-3746326.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200'

export const HeaderProfileAvatarMenuStoryProps = (icon: string): HeaderMenuItem => {
  return {
    text: profileAvatarmenuItemReg.Text,
    Icon: <HeaderProfileIcon icon={icon} />,
    className: profileAvatarmenuItemReg.ClassName,
    // position: profileAvatarmenuItemReg.Position,
    path: href('Pages/Profile/Logged In'),
    key: `avatar-menu-profile`,
  }
}

export const HeaderSignoutAvatarMenuStoryProps: HeaderMenuItem = {
  text: signoutAvatarmenuItemReg.Text,
  Icon: signoutAvatarmenuItemReg.Icon,
  className: signoutAvatarmenuItemReg.ClassName,
  // position: signoutAvatarmenuItemReg.Position,
  path: href('Pages/Landing/Logged Out'),
  key: `avatar-menu-logout`,
}

export const AvatarMenuItem: AddonItem = {
  Item: () => (
    <AvatarMenu
      avatarUrl={avatarPicture}
      menuItems={[
        HeaderProfileAvatarMenuStoryProps(avatarPicture),
        HeaderSignoutAvatarMenuStoryProps,
      ]}
      key="avatar-menu"
    />
  ),
  key: 'avatar-menu',
}
