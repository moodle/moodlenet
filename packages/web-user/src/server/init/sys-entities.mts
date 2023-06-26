import { Collection } from '@moodlenet/collection/server'
import { EdAssetType, IscedField, IscedGrade, Language, License } from '@moodlenet/ed-meta/server'
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
import type { ProfileDataType } from '../types.mjs'
import { betterTokenContext } from '../util.mjs'
import { publicFilesHttp } from './fs.mjs'

export const { Profile } = await shell.call(registerEntities)<
  {
    Profile: EntityCollectionDef<ProfileDataType>
  },
  WebUserEntityNames
>({
  Profile: {},
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
  return [IscedField, IscedGrade, Language, EdAssetType, License].some(entity =>
    isSameClass(entity.entityClass, entityClass),
  )
}

function isContributionClass(entityClass: EntityClass<any>) {
  return [Resource, Collection].some(entity => isSameClass(entity.entityClass, entityClass))
}
await shell.call(registerAccessController)({
  async u({ entityClass }) {
    const { isRootOrAdmin, anon } = await betterTokenContext()
    if (isRootOrAdmin) {
      return true
    } else if (anon) {
      return false
    } else if (isSameClass(Profile.entityClass, entityClass)) {
      return isCurrentUserEntity()
    } else if (isContributionClass(entityClass)) {
      return isCurrentUserCreatorOfCurrentEntity()
    } else if (isEdMetaClass(entityClass)) {
      return false
    }
    return false
  },
  async d({ entityClass }) {
    const { isRootOrAdmin, anon } = await betterTokenContext()
    if (isRootOrAdmin) {
      return true
    } else if (anon) {
      return false
    } else if (isContributionClass(entityClass)) {
      return isCurrentUserCreatorOfCurrentEntity()
    }
    return false
  },
  async r({ entityClass }) {
    const { isRootOrAdmin } = await betterTokenContext()
    const published_and_publisher = `${currentEntityVar}.published && ${creatorEntityDocVar}.publisher`
    if (isRootOrAdmin) {
      return true
    } else if (isSameClass(Profile.entityClass, entityClass)) {
      return `${isCurrentUserEntity()} || ${currentEntityVar}.publisher`
    } else if (isContributionClass(entityClass)) {
      return `${isCurrentUserCreatorOfCurrentEntity()} 
          || ${published_and_publisher}`
    } else if (isEdMetaClass(entityClass)) {
      return `${currentEntityVar}.published`
    }
    return false
  },
  async c(entityClass) {
    const { isRootOrAdmin, anon } = await betterTokenContext()
    if (isRootOrAdmin) {
      return true
    }
    if (anon) {
      return false
    }
    if (isContributionClass(entityClass)) {
      return true
    }
    return false
  },
})

// SysEntitiesEvents.addListener('created-new', ({ creator, newEntity }) => {
//   const isProfileCreator =
//     creator.type === 'entity' &&
//     WebUserEntitiesTools.isIdOfType({ id: creator.entityIdentifier, type: 'Profile' })
//   const isResource = EdResourceEntitiesTools.isIdOfType({ id: newEntity._id, type: 'Resource' })
//   const isCollection = CollectionEntitiesTools.isIdOfType({
//     id: newEntity._id,
//     type: 'Collection',
//   })
//   if (!(isProfileCreator && (isResource || isCollection))) {
//     return
//   }
// })
