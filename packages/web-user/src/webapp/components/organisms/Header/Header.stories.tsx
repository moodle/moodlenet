import { HeaderMenuItemRegItem } from '@moodlenet/react-app/ui'
import { href } from '@moodlenet/react-app/ui'
import { ClassName, Icon, Position, Text } from './Header.js'

export const HeaderProfileStoryProps: HeaderMenuItemRegItem = {
  Text: Text,
  Icon: (
    <Icon icon="https://images.pexels.com/photos/3746326/pexels-photo-3746326.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200" />
  ),
  ClassName: ClassName,
  Position: Position,
  Path: href('Pages/Profile/Logged In'),
}
