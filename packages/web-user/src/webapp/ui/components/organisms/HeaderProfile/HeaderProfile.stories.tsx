import { href } from '@moodlenet/react-app/common'
import { HeaderMenuItem } from '@moodlenet/react-app/ui'
import {
  HeaderProfileIcon,
  profileAvatarmenuItemReg,
  signoutAvatarmenuItemReg,
} from './HeaderProfile.js'

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
