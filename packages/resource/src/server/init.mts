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
import { ResourceDataType } from './types.mjs'

shell.call(plugin)<MyWebDeps>({
  mainComponentLoc: ['dist', 'webapp', 'MainComponent.js'],
  deps: { me },
})

export const { Resource } = await shell.call(registerEntities)<{
  Resource: EntityCollectionDef<ResourceDataType>
}>({
  Resource: {},
})
await shell.call(registerAccessController)({
  u() {
    return `(${isEntityClass(Resource.entityClass)} && ${isCreator()}) || null`
  },
  r(/* { myPkgMeta } */) {
    return `${isEntityClass(Resource.entityClass)} || null` // && ${myPkgMeta}.xx == null`
  },
  c(entityClass) {
    if (!isSameClass(Resource.entityClass, entityClass)) {
      return
    }
    // FIXME: WHAT TO CHECK ?
    return true
  },
})

export const resourceFiles = await fileStoreFactory(shell, 'resources')
export const publicFiles = await fileStoreFactory(shell, 'public')
export const publicFilesHttp = await publicFiles.mountStaticHttpServer('public')
