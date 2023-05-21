import type { EntityCollectionDef } from '@moodlenet/system-entities/server'
import {
  isCurrentOfEntityClass2Aql,
  isCurrentUserCreatorOfCurrentEntity,
  isSameClass,
  registerAccessController,
  registerEntities,
} from '@moodlenet/system-entities/server'
import type { EdResourceEntityNames } from '../../common/types.mjs'
import { shell } from '../shell.mjs'
import type { ResourceDataType } from '../types.mjs'

export const { Resource } = await shell.call(registerEntities)<
  {
    Resource: EntityCollectionDef<ResourceDataType>
  },
  EdResourceEntityNames
>({
  Resource: {},
})
await shell.call(registerAccessController)({
  u() {
    return `(${isCurrentOfEntityClass2Aql(
      Resource.entityClass,
    )} && ${isCurrentUserCreatorOfCurrentEntity()}) || null`
  },
  r(/* { myPkgMeta } */) {
    return `${isCurrentOfEntityClass2Aql(Resource.entityClass)} || null` // && ${myPkgMeta}.xx == null`
  },
  c(entityClass) {
    if (!isSameClass(Resource.entityClass, entityClass)) {
      return
    }
    // FIXME: WHAT TO CHECK ?
    return true
  },
})
