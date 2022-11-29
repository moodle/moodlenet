import { HeaderMenuItem, href } from '@moodlenet/react-app/ui'
import { className, Icon, key, position, text } from './Header.js'

export const HeaderProfileStoryProps = (icon: string): HeaderMenuItem => {
  return {
    text: text,
    Icon: <Icon icon={icon} />,
    className: className,
    position: position,
    path: href('Pages/Profile/Logged In'),
    key: key,
  }
}

export default HeaderProfileStoryProps
