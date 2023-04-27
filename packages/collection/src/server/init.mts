import { plugin, registerOpenGraphProvider } from '@moodlenet/react-app/server'
import fileStoreFactory from '@moodlenet/simple-file-store/server'
import {
  EntityCollectionDef,
  isCreator,
  isCurrentOfEntityClass2Aql,
  isSameClass,
  registerAccessController,
  registerEntities,
} from '@moodlenet/system-entities/server'
import type { MyWebDeps } from '../common/types.mjs'
import { matchCollectionHomePageRoutePathKey } from '../common/webapp-routes.mjs'
import { expose as me } from './expose.mjs'
import { getCollection } from './lib.mjs'
import { shell } from './shell.mjs'
import { CollectionDataType } from './types.mjs'

shell.call(plugin)<MyWebDeps>({
  mainComponentLoc: ['dist', 'webapp', 'MainComponent.js'],
  deps: { me },
})

export const { Collection } = await shell.call(registerEntities)<{
  Collection: EntityCollectionDef<CollectionDataType>
}>({
  Collection: {},
})
await shell.call(registerAccessController)({
  u() {
    return `(${isCurrentOfEntityClass2Aql(Collection.entityClass)} && ${isCreator()}) || null`
  },
  r(/* { myPkgMeta } */) {
    return `${isCurrentOfEntityClass2Aql(Collection.entityClass)} || null` // && ${myPkgMeta}.xx == null`
  },
  c(entityClass) {
    if (!isSameClass(Collection.entityClass, entityClass)) {
      return
    }
    // FIXME: WHAT TO CHECK ?
    return true
  },
})

export const publicFiles = await fileStoreFactory(shell, 'public')
export const publicFilesHttp = await publicFiles.mountStaticHttpServer('public')

shell.call(registerOpenGraphProvider)({
  async provider(webappPath) {
    const key = matchCollectionHomePageRoutePathKey(webappPath)
    if (!key) {
      return
    }
    const collectionRecord = await getCollection(key)
    if (!collectionRecord) {
      return
    }
    const image = collectionRecord.entity.image
      ? publicFilesHttp.getFileUrl({ directAccessId: collectionRecord.entity.image.directAccessId })
      : ''
    return {
      description: collectionRecord.entity.description,
      image: image,
      title: collectionRecord.entity.title,
    }
  },
})
