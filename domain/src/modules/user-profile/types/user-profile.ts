import { _maybe, _nullish, date_time_string, flags, non_negative_integer } from '@moodle/lib-types'
import { contentLanguageId, contentLicenseId } from '../../content'
import { eduIscedFieldId, eduIscedLevelId } from '../../edu'
import { featuredContent, myPublishedContribution, suggestedContent, userProfileMoodlenetData } from '../../moodlenet'
import { userAccountRecord } from '../../user-account'
import { myDrafts } from './drafts'
import { profileInfo } from './profile-info'

export type userProfileId = string

export type userProfileRecord = {
  id: userProfileId
  userAccount: userAccountExcerpt
  info: profileInfo
  myDrafts: myDrafts
  eduInterestFields: eduInterestFields
  appData: {
    urlSafeProfileName: string
    moodlenet: userProfileMoodlenetData
  }
}

export type userAccountExcerpt = Pick<userAccountRecord, 'roles' | 'id'>

export type eduInterestFields = {
  iscedFields: eduIscedFieldId[]
  iscedLevels: eduIscedLevelId[]
  languages: contentLanguageId[]
  licenses: contentLicenseId[]
}
export type userProfilePermissions = flags<'follow' | 'editRoles' | 'sendMessage' | 'report' | 'editProfile'>

export type userProfileAccessObject = {
  id: userProfileId
  itsMe: boolean
  profileInfo: profileInfo
  permissions: userProfilePermissions
  flags: flags<'following'>
  user: _maybe<userAccountExcerpt>
  appData: {
    urlSafeProfileName: string
    moodlenet: {
      preferences:
        | _nullish
        | {
            useMyInterestsAsDefaultFilters: boolean
          }
      featuredContent: featuredContent[]
      suggestedContent:
        | _nullish
        | {
            listCreationDate: date_time_string
            list: suggestedContent[]
          }
      published: {
        contributions: myPublishedContribution[]
      }
      points: {
        // recalculatedDate: date_time_string
        amount: non_negative_integer
      }
      stats: {
        followersCount: non_negative_integer
      }
    }
  }
}
