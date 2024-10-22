import { _maybe, flags } from '@moodle/lib-types'
import { languageId, licenseId } from '../../content'
import { iscedFieldId, iscedLevelId } from '../../edu'
import { userId, userRole } from '../../iam'
import { profileInfo } from './profile-info'
import { myDrafts } from './drafts'
import { moodlenetUserData } from '../../net'

export type userHomeId = string

export type userHomeRecord = {
  id: userHomeId
  iamUser: iamUserExcerpt
  profileInfo: profileInfo
  myDrafts: myDrafts
  eduInterestFields: userInterestFields
  moodlenet: moodlenetUserData
}

export type iamUserExcerpt = { id: userId; roles: userRole[] }

export type userInterestFields = {
  iscedFields: iscedFieldId[]
  iscedLevels: iscedLevelId[]
  languages: languageId[]
  licenses: licenseId[]
}
export type userHomePermissions = flags<'follow' | 'editRoles' | 'sendMessage' | 'report' | 'editProfile'>

export type user_home_access_object = {
  id: userHomeId
  profileInfo: profileInfo
  permissions: userHomePermissions
  flags: flags<'followed'>
  user: _maybe<iamUserExcerpt>
}
