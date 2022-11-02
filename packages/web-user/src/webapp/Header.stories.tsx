import { HeaderAvatarMenuItemRegItem } from '@moodlenet/component-library'
import { ClassName, Icon, Position, Text } from './Header.js'

export const HeaderProfileStoryProps: HeaderAvatarMenuItemRegItem = {
  Text: Text,
  Icon: () => (
    <Icon
      icon="https://images.pexels.com/photos/3746326/pexels-photo-3746326.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200"
      href="/profile"
    />
  ),
  ClassName: ClassName,
  Position: Position,
}
