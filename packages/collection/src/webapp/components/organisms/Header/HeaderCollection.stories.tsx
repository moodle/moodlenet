import { href } from '@moodlenet/react-app/common'
import { HeaderMenuItem } from '@moodlenet/react-app/ui'
import { Icon, key, text } from './HeaderCollection.js'

export const HeaderCollectionStoryProps: HeaderMenuItem = {
  text: text,
  Icon: Icon,
  path: href('Pages/Collection/New'),
  key: key,
}

export default HeaderCollectionStoryProps
