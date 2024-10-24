import { _maybe, flags } from '@moodle/lib-types'
import { contentLanguageId, contentLicenseId } from '../../content'
import { eduIscedFieldId, eduIscedLevelId } from '../../edu'
import { userAccountRecord } from '../../user-account'
import { profileInfo } from './profile-info'
import { myDrafts } from './drafts'
import { userProfileMoodlenetData } from '../../net'

export type userProfileId = string

export type userProfileRecord = {
  id: userProfileId
  userAccountUser: userAccountUserExcerpt
  info: profileInfo
  myDrafts: myDrafts
  eduInterestFields: userInterestFields
  appData: {
    urlSafeProfileName: string
    moodlenet: userProfileMoodlenetData
  }
}

export type userAccountUserExcerpt = Pick<userAccountRecord, 'roles' | 'id'>

export type userInterestFields = {
  iscedFields: eduIscedFieldId[]
  iscedLevels: eduIscedLevelId[]
  languages: contentLanguageId[]
  licenses: contentLicenseId[]
}
export type userProfilePermissions = flags<'follow' | 'editRoles' | 'sendMessage' | 'report' | 'editProfile'>

export type userProfileAccessObject = {
  id: userProfileId
  profileInfo: profileInfo
  permissions: userProfilePermissions
  flags: flags<'followed'>
  user: _maybe<userAccountUserExcerpt>
  // REVIEW: instead of `urlSafeProfileName` there could be a appData: { moodlenet: { homepage: url_string } }
  urlSafeProfileName: string
}
