import { HeaderMenuItem, href } from '@moodlenet/react-app/ui'
import { Icon, key, text } from './HeaderCollection.js'

export const HeaderCollectionStoryProps = (): HeaderMenuItem => {
  return {
    text: text,
    Icon: Icon,
    path: href('Pages/Collection/New'),
    key: key,
  }
}

export default HeaderCollectionStoryProps
