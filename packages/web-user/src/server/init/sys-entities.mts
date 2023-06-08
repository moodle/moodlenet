import type { EntityCollectionDef } from '@moodlenet/system-entities/server'
import {
  isCurrentOfEntityClass2Aql,
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
await shell.call(registerAccessController)({
  u() {
    return `(${isCurrentOfEntityClass2Aql(
      Profile.entityClass,
    )} && ${isCurrentUserEntity()}) || null`
  },
  r(/* { myPkgMeta } */) {
    return `${isCurrentOfEntityClass2Aql(Profile.entityClass)} || null` // && ${myPkgMeta}.xx == null`
  },
  c(entityClass) {
    if (!isSameClass(Profile.entityClass, entityClass)) {
      return
    }
    // FIXME: WHAT TO CHECK ?
    return true
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
