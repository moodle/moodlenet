import { d_u, date_time_string, map, url_string } from '@moodle/lib-types'
import { aiAgentResourceAnalysisStatus } from '../../ai-agent'
import { textExtractionStatus } from '../../asset-text-extraction'
import { contentLanguageCode, contentLicenseCode } from '../../content'
import { eduIscedFieldCode, eduIscedLevelCode } from '../../edu'
import { eduCollectionData, eduResourceData } from '../../edu/types/edu-content'
import { moodlenetPublicEduResourceId } from '../../moodlenet/types/access-objects/eduResource'
import { asset } from '../../storage'
import { userAccountRecord } from '../../user-account'

export type profileInfoMeta = {
  displayName: string
  aboutMe: string
  location: string
  siteUrl: null | url_string
}
export type profileInfo = profileInfoMeta & {
  lastEditDate: date_time_string
  background: asset
  avatar: asset
}
export type profileImageType = ('avatar' | 'background') & keyof profileInfo

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
  iscedFields: { code: eduIscedFieldCode }[]
  iscedLevels: { code: eduIscedLevelCode }[]
  languages: { code: contentLanguageCode }[]
  licenses: { code: contentLicenseCode }[]
}

export type eduCollectionDraft = draft<
  eduCollectionData & {
    items: draftEduCollectionEduResourceRef[]
  }
>
type draftEduCollectionEduResourceRef = d_u<
  {
    myDraft: { eduResourceDraftId: eduResourceDraftId }
    publishedOnMoodlenet: { moodlenetPublicEduResourceId: moodlenetPublicEduResourceId }
  },
  'type'
>

export type eduResourceDraft = draft<
  eduResourceData & {
    assetProcess: {
      textExtractionStatus: textExtractionStatus
      aiAnalysis: aiAgentResourceAnalysisStatus
    }
  }
>

type myDrafts = {
  eduResource: map<eduResourceDraft, eduResourceDraftId>
  eduCollection: map<eduCollectionDraft, eduCollectionDraftId>
}


type draft<dataType extends eduResourceData | eduCollectionData> = {
  data: dataType
  created: date_time_string
  lastEditDate: date_time_string
  // updates: { date: date_time_string; diff: jsonDiff }[]
}

export type eduResourceDraftId = string
export type eduCollectionDraftId = string
export type draftId = eduResourceDraftId & eduCollectionDraftId
