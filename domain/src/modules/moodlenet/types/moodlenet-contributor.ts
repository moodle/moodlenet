import { _nullish, d_u, date_time_string, flags, non_negative_integer } from '@moodle/lib-types'
import { profileInfo, userProfileId } from '../../user-profile'

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

export type moodlenetContributorAccess = d_u<
  {
    public: unknown
    protected: unknown
  },
  'level'
>

export type moodlenetContributorRecord = {
  id: moodlenetContributorId
  access: moodlenetContributorAccess
  userProfile: moodlenetContributorProfileExcerpt
  slug: string
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
    // recalculatedDate: date_time_string
    points: non_negative_integer
  }
}
type publicContributionRef<refData = unknown> = refData & { id: string }

type suggestedContentRef<refData = unknown> = refData & { id: string }
type featuredContentRef<refData = unknown> = refData & {
  id: string
  sinceDate: date_time_string
  removingDate: _nullish | date_time_string
}
type permissionsOnMoodlenetContributor = flags<'follow' | 'sendMessage' | 'report' | 'editProfileInfo'>

export type moodlenetContributorAccessObject = {
  id: moodlenetContributorId
  slug: string
  profileInfo: moodlenetContributorProfileExcerpt['info']
  itsMe: boolean
  contributions: moodlenetContributions
  linkedContent: linkedContent
  permissions: permissionsOnMoodlenetContributor
  stats: {
    points: non_negative_integer
    // followersCount: non_negative_integer
  }
}
