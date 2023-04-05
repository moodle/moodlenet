import { plugin } from '@moodlenet/react-app/server'
import fileStoreFactory from '@moodlenet/simple-file-store/server'
import {
  EntityCollectionDef,
  isSameClass,
  registerAccessController,
  registerEntities,
} from '@moodlenet/system-entities/server'
import { isCreator, isEntityClass } from '@moodlenet/system-entities/server/aql-ac'
import type { MyWebDeps } from '../common/types.mjs'
import { expose as me } from './expose.mjs'
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
    return `(${isEntityClass(Collection.entityClass)} && ${isCreator()}) || null`
  },
  r(/* { myPkgMeta } */) {
    return `${isEntityClass(Collection.entityClass)} || null` // && ${myPkgMeta}.xx == null`
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
export const publicFilesHttp = await publicFiles.mountStaticHttpServer('/public')
