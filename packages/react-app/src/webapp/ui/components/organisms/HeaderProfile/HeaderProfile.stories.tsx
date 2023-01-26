import { href } from '../../elements/link.js'
import { HeaderMenuItem } from '../Header/addons.js'
import { avatarmenuItemReg, HeaderProfileIcon } from './HeaderProfile.js'

export const HeaderProfileStoryProps = (icon: string): HeaderMenuItem => {
  return {
    text: avatarmenuItemReg.Text,
    Icon: <HeaderProfileIcon icon={icon} />,
    className: avatarmenuItemReg.ClassName,
    position: avatarmenuItemReg.Position,
    path: href('Pages/Profile/Logged In'),
    key: `HeaderProfileItem`,
  }
}

export default HeaderProfileStoryProps
