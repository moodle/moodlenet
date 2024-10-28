import { _nullish, date_time_string, flags, non_negative_integer, url_string } from '@moodle/lib-types'
import { eduIscedFieldCode } from '../../edu'
import { asset } from '../../storage'
import { userAccountId } from '../../user-account'
import { moodlenetPublicEduResourceCollectionId, moodlenetPublicEduResourceId } from './moodlenet-public-contributions'

export type moodlenetContributorId = string
type moodlenetContributorProfile = {
  info: {
    displayName: string
    aboutMe: string
    location: string
    siteUrl: _nullish | url_string
    background: _nullish | asset
    avatar: _nullish | asset
  }
}

export type moodlenetContributorRecord = {
  id: moodlenetContributorId
  profile: moodlenetContributorProfile
  preferences: {
    useMyInterestsAsDefaultFilters: boolean
  }
  suggestedContent: {
    listCreationDate: date_time_string
    lists: {
      eduResourceCollections: suggestedContentRef<{ id: moodlenetPublicEduResourceCollectionId }>[]
      eduResources: suggestedContentRef<{ id: moodlenetPublicEduResourceId }>[]
      moodlenetContributors: suggestedContentRef<{ id: moodlenetContributorId }>[]
    }[]
  }
  contributions: {
    eduResourcesCollections: publicContributionRef<{ id: moodlenetPublicEduResourceCollectionId }>[]
    eduResources: publicContributionRef<{ id: moodlenetPublicEduResourceId }>[]
  }
  linkedContent: {
    eduResourceCollections: featuredContentRef<{ id: moodlenetPublicEduResourceCollectionId }>[]
    eduResources: featuredContentRef<{ id: moodlenetPublicEduResourceId }>[]
    moodlenetContributors: featuredContentRef<{ id: moodlenetContributorId }>[]
    iscedFields: featuredContentRef<{ code: eduIscedFieldCode }>[]
  }
  stats: {
    // recalculatedDate: date_time_string
    points: non_negative_integer
  }
  moderations: userModerations
}
type publicContributionRef<refData> = refData

type suggestedContentRef<refData> = refData
type featuredContentRef<refData> = refData & {
  sinceDate: date_time_string
  removingDate: _nullish | date_time_string
}
type permissionsOnMoodlenetContributor = flags<'follow' | 'sendMessage' | 'report' | 'editProfileInfo'>

export type accessMoodlenetContributor = {
  moodlenetContributorId: moodlenetContributorId
  profile: moodlenetContributorProfile
  itsMe: boolean
  permissions: permissionsOnMoodlenetContributor
  stats: {
    points: non_negative_integer
    followersCount: non_negative_integer
  }
}

type reportType = string //TODO: type:desc map in moodlenet Configs?
type reportAbuseForm = {
  type: reportType
  comment: string | undefined
}
type reportAbuseItem = {
  date: date_time_string
  reporter: userAccountId
  reason: reportAbuseForm
}

type userModerations = {
  reports: {
    items: reportAbuseItem[]
    amount: non_negative_integer
  }
}
