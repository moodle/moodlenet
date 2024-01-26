import { Collection } from '@moodlenet/collection/server'
import {
  BloomCognitive,
  EdAssetType,
  IscedField,
  IscedGrade,
  Language,
  License,
} from '@moodlenet/ed-meta/server'
import { Resource } from '@moodlenet/ed-resource/server'
import type { EntityClass } from '@moodlenet/system-entities/common'
import type { EntityCollectionDef } from '@moodlenet/system-entities/server'
import {
  creatorEntityDocVar,
  currentEntityVar,
  isCurrentUserCreatorOfCurrentEntity,
  isCurrentUserEntity,
  isSameClass,
  registerAccessController,
  registerEntities,
  registerEntityInfoProvider,
} from '@moodlenet/system-entities/server'
import type { WebUserEntityNames } from '../../common/exports.mjs'
import { PROFILE_HOME_PAGE_ROUTE_PATH } from '../../common/exports.mjs'
import { shell } from '../shell.mjs'
import type { EntityPointsDataType, ProfileDataType } from '../types.mjs'
import { betterTokenContext } from '../util.mjs'
import { publicFilesHttp } from './fs.mjs'

export const { Profile, EntityPoints } = await shell.call(registerEntities)<
  {
    Profile: EntityCollectionDef<ProfileDataType>
    EntityPoints: EntityCollectionDef<EntityPointsDataType>
  },
  WebUserEntityNames
>({
  Profile: {},
  EntityPoints: {},
})
registerEntityInfoProvider({
  entityClass: Profile.entityClass,
  aqlProvider(entityDocVar) {
    const homepagePath = `SUBSTITUTE( '${PROFILE_HOME_PAGE_ROUTE_PATH}' , ':key/:slug' , CONCAT(${entityDocVar}._key, '/', ${entityDocVar}.webslug) )`
    return `{ 
      iconUrl: ${publicFilesHttp.getFileUrlAql({
        directAccessIdVar: `${entityDocVar}.avatarImage.directAccessId`,
      })}, 
      name: ${entityDocVar}.displayName, 
      homepagePath: ${homepagePath}
    }`
  },
})

function isEdMetaClass(entityClass: EntityClass<any>) {
  return [IscedField, IscedGrade, Language, EdAssetType, License, BloomCognitive].some(entity =>
    isSameClass(entity.entityClass, entityClass),
  )
}

function isContributionClass(entityClass: EntityClass<any>) {
  return [Resource, Collection].some(entity => isSameClass(entity.entityClass, entityClass))
}
await shell.call(registerAccessController)({
  async u({ entityClass }) {
    const { isRootOrAdmin } = await betterTokenContext() //BEWARE ! this token is valued by webapp only!! e.g. won't be by oauth !!
    if (isRootOrAdmin) {
      return true
    }
    if (isSameClass(Profile.entityClass, entityClass)) {
      return isCurrentUserEntity()
    }
    if (isContributionClass(entityClass)) {
      return isCurrentUserCreatorOfCurrentEntity()
    }
    if (isEdMetaClass(entityClass)) {
      return false
    }
    return false
  },
  async d({ entityClass }) {
    const { isRootOrAdmin } = await betterTokenContext() //BEWARE ! this token is valued by webapp only!! e.g. won't be by oauth !!
    if (isRootOrAdmin) {
      return true
    }
    if (isContributionClass(entityClass)) {
      return isCurrentUserCreatorOfCurrentEntity()
    }
    if (isEdMetaClass(entityClass)) {
      return false
    }
    return false
  },
  async r({ entityClass }) {
    const { isRootOrAdmin } = await betterTokenContext() //BEWARE ! this token is valued by webapp only!! e.g. won't be by oauth !!
    const published_and_publisher = `${currentEntityVar}.published && (!${creatorEntityDocVar} || ${creatorEntityDocVar}.publisher)`
    if (isRootOrAdmin) {
      return true
    }
    if (isSameClass(Profile.entityClass, entityClass)) {
      return `${isCurrentUserEntity()} || ${currentEntityVar}.publisher`
    }
    if (isContributionClass(entityClass)) {
      return `${isCurrentUserCreatorOfCurrentEntity()} 
          || ${published_and_publisher}`
    }
    if (isEdMetaClass(entityClass)) {
      return `${currentEntityVar}.published`
    }
    return false
  },
  async c(entityClass) {
    const { isRootOrAdmin } = await betterTokenContext() //BEWARE ! this token is valued by webapp only!! e.g. won't be by oauth !!
    if (isRootOrAdmin) {
      return true
    }
    if (isContributionClass(entityClass)) {
      return true
    }
    if (isEdMetaClass(entityClass)) {
      return false
    }
    return false
  },
})
