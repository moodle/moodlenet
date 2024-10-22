import { _maybe, flags } from '@moodle/lib-types'
import { language_id, license_id } from '../../content'
import { isced_field_id, isced_level_id } from '../../edu'
import { user_id, user_role } from '../../iam'
import { profileInfo } from './profile-info'
import { myDrafts } from './drafts'
import { moodlenetUserData } from '../../net'

export type user_home_id = string

export type userHomeRecord = {
  id: user_home_id
  iamUser: iam_user_excerpt
  profileInfo: profileInfo
  myDrafts: myDrafts
  eduInterestFields: userInterestFields
  moodlenet: moodlenetUserData
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
