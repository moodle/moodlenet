import { plugin, registerOpenGraphProvider } from '@moodlenet/react-app/server'
import type { MyWebDeps } from '../../common/types.mjs'
import { matchResourceHomePageRoutePathKey } from '../../common/webapp-routes.mjs'
import { expose as me } from '../expose.mjs'
import { getResource } from '../lib.mjs'
import { shell } from '../shell.mjs'
import { publicFilesHttp } from './fs.mjs'

shell.call(plugin)<MyWebDeps>({
  initModuleLoc: ['dist', 'webapp', 'exports', 'init.mjs'],
  deps: { me },
})
shell.call(registerOpenGraphProvider)({
  async provider(webappPath) {
    const key = matchResourceHomePageRoutePathKey(webappPath)
    if (!key) {
      return
    }
    const resourceRecord = await getResource(key)
    if (!resourceRecord) {
      return
    }
    const image = resourceRecord.entity.image
      ? publicFilesHttp.getFileUrl({ directAccessId: resourceRecord.entity.image.directAccessId })
      : ''
    return {
      description: resourceRecord.entity.description,
      image: image,
      title: resourceRecord.entity.title,
    }
  },
})
