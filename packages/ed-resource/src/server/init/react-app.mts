import { plugin, registerOpenGraphProvider } from '@moodlenet/react-app/server'
import type { MyWebDeps } from '../../common/types.mjs'
import { matchResourceHomePageRoutePath } from '../../common/webapp-routes.mjs'
import { expose as me } from '../expose.mjs'
import { getImageUrl } from '../lib.mjs'
import { getResource } from '../services.mjs'
import { shell } from '../shell.mjs'

shell.call(plugin)<MyWebDeps>({
  initModuleLoc: ['dist', 'webapp', 'exports', 'init.mjs'],
  deps: { me },
})
shell.call(registerOpenGraphProvider)({
  async provider(webappPath) {
    const key = matchResourceHomePageRoutePath(webappPath)?.params.key
    if (!key) {
      return
    }
    const resourceRecord = await getResource(key)
    if (!resourceRecord) {
      return
    }
    const image = resourceRecord.entity.image ? getImageUrl(resourceRecord.entity.image) : undefined

    return {
      description: resourceRecord.entity.description,
      image: image,
      title: resourceRecord.entity.title,
    }
  },
})
