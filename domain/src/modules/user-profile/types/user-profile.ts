import { date_time_string } from '@moodle/lib-types'
import { aiAgentResourceSuggestionStatus } from '../../ai-agent'
import { textExtractionStatus } from '../../asset-text-extraction'
import { contentLanguageCode, contentLicenseCode } from '../../content'
import { eduIscedFieldCode, eduIscedLevelCode } from '../../edu'
import { eduResourceCollectionData, eduResourceData } from '../../edu/types/edu-content'
import { userAccountRecord } from '../../user-account'
import { profileInfo } from './profile-info'

export type userProfileId = string

export type userProfileRecord = {
  id: userProfileId
  userAccount: userAccountExcerpt
  info: profileInfo
  myDrafts: myDrafts
  eduInterestFields: eduInterestFields
}

type userAccountExcerpt = Pick<userAccountRecord, /* 'roles' | */ 'id'>

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
  eduResourceCollections: draft<eduResourceCollectionData>[]
}

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
