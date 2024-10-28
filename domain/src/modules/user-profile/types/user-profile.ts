import { _nullish, d_u, date_time_string, url_string } from '@moodle/lib-types'
import { aiAgentResourceSuggestionStatus } from '../../ai-agent'
import { textExtractionStatus } from '../../asset-text-extraction'
import { contentLanguageCode, contentLicenseCode } from '../../content'
import { eduIscedFieldCode, eduIscedLevelCode } from '../../edu'
import { eduResourceCollectionData, eduResourceData } from '../../edu/types/edu-content'
import { moodlenetPublicEduResourceId } from '../../moodlenet/types/moodlenet-public-contributions'
import { asset } from '../../storage'
import { userAccountRecord } from '../../user-account'

export type profileInfo = {
  displayName: string
  aboutMe: string
  location: string
  siteUrl: _nullish | url_string
  background: _nullish | asset
  avatar: _nullish | asset
}
export type profileImage = 'avatar' | 'background'

export type userProfileId = string

export type userProfileRecord = {
  id: userProfileId
  userAccount: userAccountExcerpt
  info: profileInfo
  myDrafts: myDrafts
  eduInterestFields: eduInterestFields
}

export type userAccountExcerpt = Pick<userAccountRecord, 'roles' | 'id'> //REVIEW remove roles ?

type eduInterestFields = {
  iscedFields: eduIscedFieldCode[]
  iscedLevels: eduIscedLevelCode[]
  languages: contentLanguageCode[]
  licenses: contentLicenseCode[]
}

type myDrafts = {
  eduResources: draft<
    eduResourceData & {
      assetProcess: {
        textExtractionStatus: textExtractionStatus
        aiAgentSuggestion: aiAgentResourceSuggestionStatus
      }
    }
  >[]
  eduResourceCollections: draft<
    eduResourceCollectionData & {
      items: draftEduResourceCollectionEduResourceRef[]
    }
  >[]
}

type draftEduResourceCollectionEduResourceRef = d_u<
  {
    myDraft: { draftId: draftId }
    publishedOnMoodlenet: { moodlenetPublicEduResourceId: moodlenetPublicEduResourceId }
  },
  'type'
>

export type draftId = eduResourceDraftId | eduResourceCollectionDraftId
type draft<dataType extends eduResourceData | eduResourceCollectionData> = {
  draftId: draftId
  data: dataType
  created: date_time_string
  lastUpdateDate: date_time_string
  // updates: { date: date_time_string; diff: jsonDiff }[]
}

type eduResourceDraftId = string
type eduResourceCollectionDraftId = string
