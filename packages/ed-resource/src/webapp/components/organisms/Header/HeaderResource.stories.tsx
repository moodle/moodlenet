import { href } from '@moodlenet/react-app/common'
import { HeaderMenuItem } from '@moodlenet/react-app/ui'
import { Icon, key, text } from './HeaderResource.js'

export const HeaderResourceStoryProps: HeaderMenuItem = {
  text: text,
  Icon: Icon,
  path: href('Pages/Resource/New'),
  key: key,
}

export default {
  title: 'components/organisms/header',
  component: HeaderResourceStoryProps,
  excludeStories: ['HeaderResourceStoryProps'],
}
