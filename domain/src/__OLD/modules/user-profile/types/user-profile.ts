import { d_u, date_time_string, url_string } from '@moodle/lib-types'
import { contentLanguageCode, contentLicenseCode } from '../../content'
import { eduIscedFieldCode, eduIscedLevelCode } from '../../edu'
import { eduCollectionData, eduResourceData } from '../../edu/types/edu-content'
import { moodlenetPublicEduResourceId } from '../../moodlenet/types/access-objects/eduResource'
import { eduResourceIngestionOutcome } from '../../resource-ingestion'
import { eduResourceAiGenerationOutcome } from '../../resource-metadata-generation'
import { maybeAsset } from '../../storage'
import { userAccountRecord } from '../../user-account'

export type profileInfoMeta = {
  displayName: string
  aboutMe: string
  location: string
  siteUrl: null | url_string
}
export type profileInfo = profileInfoMeta & {
  lastEditDate: date_time_string
  background: maybeAsset
  avatar: maybeAsset
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

export type processStatus<data> = d_u<
  {
    neverEngaged: unknown
    awaiting: { engageDate: date_time_string }
    aborted: { engageDate: date_time_string; abortDate: date_time_string }
    finished: { engageDate: date_time_string; finishDate: date_time_string; outcome: data }
  },
  'status'
>
export type assetProcessStatus = {
  ingestion: processStatus<eduResourceIngestionOutcome>
  aiGeneration: processStatus<eduResourceAiGenerationOutcome>
}

export type eduResourceDraft = { assetProcessStatus: assetProcessStatus } & draft<eduResourceData>

type myDrafts = {
  eduResource: eduResourceDraft[]
  eduCollection: eduCollectionDraft[]
}

type draft<dataType extends eduResourceData | eduCollectionData> = {
  draftId: draftId
  data: dataType
  created: date_time_string
  lastEditDate: date_time_string
  // updates: { date: date_time_string; diff: jsonDiff }[]
}

export type eduResourceDraftId = string
export type eduCollectionDraftId = string
export type draftId = eduResourceDraftId & eduCollectionDraftId
