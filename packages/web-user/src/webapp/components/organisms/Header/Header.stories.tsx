import { HeaderMenuItem, href } from '@moodlenet/react-app/ui'
import { ClassName, Icon, Key, Position, Text } from './Header.js'

export const HeaderProfileStoryProps = (icon: string): HeaderMenuItem => {
  return {
    Text: Text,
    Icon: <Icon icon={icon} />,
    ClassName: ClassName,
    Position: Position,
    Path: href('Pages/Profile/Logged In'),
    Key: Key,
  }
}
