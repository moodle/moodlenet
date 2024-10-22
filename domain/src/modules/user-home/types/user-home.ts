import { _maybe, flags } from '@moodle/lib-types'
import { language_id, license_id } from '../../content'
import { isced_field_id, isced_level_id } from '../../edu'
import { user_id, user_role } from '../../iam'
import { profileInfo } from './profile-info'
import { myContent } from './user-content'

export type user_home_id = string
export type userHomeRecord = {
  id: user_home_id
  iamUser: iam_user_excerpt
  profileInfo: profileInfo
  myContent: myContent
  eduInterestFields: userInterestFields
  moodlenet: {
    preferences: {
      useMyInterestsAsDefaultFilters?: boolean
    }
    featuredContent: {
      bookmarked: featuredContent<'edu-resource' | 'collection-of-edu-resources'>
      following: featuredContent<'user' | 'isced-field' | 'collection-of-edu-resources'>
      liked: featuredContent<'edu-resource'>
      published: featuredContent<'edu-resource' | 'collection-of-edu-resources'>
    }
  }
}

export type contentType = 'edu-resource' | 'collection-of-edu-resources' | 'user' | 'isced-field'
export type featuredContent<t extends contentType> = {
  contentType: t
  id: string
  at: string
}

export type iam_user_excerpt = { id: user_id; roles: user_role[] }

export type userInterestFields = {
  iscedFields: isced_field_id[]
  iscedLevels: isced_level_id[]
  languages: language_id[]
  licenses: license_id[]
}
export type user_home_permissions = flags<'follow' | 'editRoles' | 'sendMessage' | 'report' | 'editProfile'>

export type user_home_access_object = {
  id: user_home_id
  profileInfo: profileInfo
  permissions: user_home_permissions
  flags: flags<'followed'>
  user: _maybe<iam_user_excerpt>
}
