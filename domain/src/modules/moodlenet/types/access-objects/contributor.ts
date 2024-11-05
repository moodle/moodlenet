import { _nullish, date_time_string, flags, non_negative_integer } from '@moodle/lib-types'
import { profileInfo, userProfileId } from '../../../user-profile'

export type moodlenetContributorId = string
type moodlenetContributorProfileExcerpt = {
  id: userProfileId
  info: profileInfo
  // info: Pick<profileInfo, 'aboutMe' | 'background' | 'avatar' | 'displayName' | 'location' | 'siteUrl'>
}

export type linkedContent = {
  like: {
    eduResources: featuredContentRef[]
  }
  follow: {
    eduCollections: featuredContentRef[]
    moodlenetContributors: featuredContentRef[]
    iscedFields: featuredContentRef[]
  }
  bookmark: {
    eduCollections: featuredContentRef[]
    eduResources: featuredContentRef[]
  }
}

type moodlenetContributions = {
  eduResourcesCollections: publicContributionRef[]
  eduResources: publicContributionRef[]
}

export type moodlenetContributorRecord = {
  id: moodlenetContributorId
  access: 'public' | 'protected'
  userProfile: moodlenetContributorProfileExcerpt
  preferences: {
    useMyInterestsAsDefaultFilters: boolean
  }
  suggestedContent: {
    listCreationDate: date_time_string
    lists: {
      eduCollections: suggestedContentRef[]
      eduResources: suggestedContentRef[]
      moodlenetContributors: suggestedContentRef[]
    }
  }
  contributions: moodlenetContributions
  linkedContent: linkedContent
  stats: {
    recalculatedDate: date_time_string
    points: non_negative_integer
    followersCount: non_negative_integer
    followingCount: non_negative_integer
    publishedResourcesCount: non_negative_integer
  }
}
type publicContributionRef<refData = unknown> = refData & { id: string }

type suggestedContentRef<refData = unknown> = refData & { id: string }
type featuredContentRef<refData = unknown> = refData & {
  id: string
  sinceDate: date_time_string
  removingDate: _nullish | date_time_string
}

export type permissionsOnMoodlenetContributor = flags<'follow' | 'sendMessage' | 'report' | 'editProfileInfo'>
export type moodlenetContributorAccessObject = {
  myLinks: flags<'followed'>
  permissions: permissionsOnMoodlenetContributor

  profileInfo: profileInfo

  id: moodlenetContributorId
  contributions: moodlenetContributions
  linkedContent: linkedContent
  stats: {
    points: non_negative_integer
    followersCount: non_negative_integer
    followingCount: non_negative_integer
    publishedResourcesCount: non_negative_integer
  }
}
