import { generateAlphanumId } from '@moodle/lib-id-gen'
import { date_time_string } from '@moodle/lib-types'
import { eduResourceMeta } from '../../../edu'
import { asset, NONE_ASSET } from '../../../storage'
import { userAccountRecord } from '../../../user-account'
import { eduResourceDraft, eduResourceDraftId, userProfileRecord } from '../../types'

export function createNewUserProfileData({ newUser }: { newUser: userAccountRecord }): userProfileRecord {
  const userProfileId = generateAlphanumId()
  const userProfileRecord: userProfileRecord = {
    id: userProfileId,
    userAccount: {
      id: newUser.id,
      roles: newUser.roles,
    },
    eduInterestFields: { iscedFields: [], iscedLevels: [], languages: [], licenses: [] },
    myDrafts: { eduCollection: [], eduResource: [] },
    info: {
      lastEditDate: newUser.creationDate,
      displayName: newUser.displayName,
      aboutMe: '',
      location: '',
      siteUrl: null,
      avatar: NONE_ASSET,
      background: NONE_ASSET,
    },
  }
  return userProfileRecord
}
export function createNewEduResourceDraftData({
  eduResourceDraftId,
  asset,
  partialEduResourceMeta,
  created,
}: {
  created: date_time_string
  partialEduResourceMeta?: Partial<eduResourceMeta>
  eduResourceDraftId: eduResourceDraftId
  asset: asset
}): eduResourceDraft {
  const newEduResourceDraft: eduResourceDraft = {
    draftId: eduResourceDraftId,
    created: created,
    lastEditDate: created,
    assetProcessStatus: {
      aiGeneration: { status: 'neverEngaged' },
      ingestion: { status: 'neverEngaged' },
    },
    data: {
      title: '',
      description: '',
      asset,
      bloomLearningOutcomes: [],
      image: NONE_ASSET,
      iscedField: null,
      iscedLevel: null,
      language: null,
      license: null,
      type: null,
      publicationDate: null,
      ...partialEduResourceMeta,
    },
  }
  return newEduResourceDraft
}
