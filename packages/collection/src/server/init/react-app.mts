import { plugin, registerOpenGraphProvider } from '@moodlenet/react-app/server'
import type { MyWebDeps } from '../../common/types.mjs'
import { matchCollectionHomePageRoutePath } from '../../common/webapp-routes.mjs'
import { expose as me } from '../expose.mjs'
import { getImageUrl } from '../lib.mjs'
import { getCollection } from '../services.mjs'
import { shell } from '../shell.mjs'

shell.call(plugin)<MyWebDeps>({
  initModuleLoc: ['dist', 'webapp', 'exports', 'init.js'],
  deps: { me },
})

shell.call(registerOpenGraphProvider)({
  async provider(webappPath) {
    const key = matchCollectionHomePageRoutePath(webappPath)?.params.key
    if (!key) {
      return
    }
    const collectionRecord = await getCollection(key)
    if (!collectionRecord) {
      return
    }
    const image = collectionRecord.entity.image
      ? getImageUrl(collectionRecord.entity.image)
      : undefined

    return {
      description: collectionRecord.entity.description,
      image: image,
      title: collectionRecord.entity.title,
    }
  },
})
