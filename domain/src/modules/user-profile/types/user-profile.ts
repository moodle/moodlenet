import { _maybe, flags } from '@moodle/lib-types'
import { languageId, licenseId } from '../../content'
import { iscedFieldId, iscedLevelId } from '../../edu'
import { userAccountId, userRole } from '../../user-account'
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

export type userAccountUserExcerpt = { id: userAccountId; roles: userRole[] }

export type userInterestFields = {
  iscedFields: iscedFieldId[]
  iscedLevels: iscedLevelId[]
  languages: languageId[]
  licenses: licenseId[]
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
