import type { EntityCollectionDef } from '@moodlenet/system-entities/server'
import {
  isCurrentOfEntityClass2Aql,
  isCurrentUserCreatorOfCurrentEntity,
  isSameClass,
  registerAccessController,
  registerEntities,
} from '@moodlenet/system-entities/server'
import type { CollectionEntityNames } from '../../common/types.mjs'
import { shell } from '../shell.mjs'
import type { CollectionDataType } from '../types.mjs'

export const { Collection } = await shell.call(registerEntities)<
  {
    Collection: EntityCollectionDef<CollectionDataType>
  },
  CollectionEntityNames
>({
  Collection: {},
})

await shell.call(registerAccessController)({
  u() {
    return `(${isCurrentOfEntityClass2Aql(
      Collection.entityClass,
    )} && ${isCurrentUserCreatorOfCurrentEntity()}) || null`
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
