import { _nullish, d_u, date_time_string, flags, non_negative_integer } from '@moodle/lib-types'
import { eduIscedFieldCode } from '../../edu'
import { asset } from '../../storage'
import { profileInfo, userProfileId } from '../../user-profile'
import { moodlenetPublicEduResourceCollectionId, moodlenetPublicEduResourceId } from './moodlenet-public-contributions'

export type moodlenetContributorId = string
type moodlenetContributorProfileExcerpt = {
  id: userProfileId
  info: Pick<profileInfo, 'aboutMe' | 'background' | 'avatar' | 'displayName' | 'location' | 'siteUrl'>
}

type linkedContent = {
  likes: {
    eduResources: featuredContentRef<{
      id: moodlenetPublicEduResourceId
    }>[]
  }
  following: {
    eduResourceCollections: featuredContentRef<{
      id: moodlenetPublicEduResourceCollectionId
    }>[]
    moodlenetContributors: featuredContentRef<{
      id: moodlenetContributorId
    }>[]
    iscedFields: featuredContentRef<{
      code: eduIscedFieldCode
    }>[]
  }
  bookmarked: {
    eduResourceCollections: featuredContentRef<{
      id: moodlenetPublicEduResourceCollectionId
    }>[]
    eduResources: featuredContentRef<{
      id: moodlenetPublicEduResourceId
    }>[]
  }
}

type moodlenetContributions = {
  eduResourcesCollections: publicContributionRef<{
    id: moodlenetPublicEduResourceCollectionId
  }>[]
  eduResources: publicContributionRef<{
    id: moodlenetPublicEduResourceId
  }>[]
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
      eduResourceCollections: suggestedContentRef<{ id: moodlenetPublicEduResourceCollectionId }>[]
      eduResources: suggestedContentRef<{ id: moodlenetPublicEduResourceId }>[]
      moodlenetContributors: suggestedContentRef<{ id: moodlenetContributorId }>[]
    }
  }
  contributions: moodlenetContributions
  linkedContent: linkedContent
  stats: {
    // recalculatedDate: date_time_string
    points: non_negative_integer
  }
}
type publicContributionRef<refData> = refData

type suggestedContentRef<refData> = refData
type featuredContentRef<refData> = refData & {
  sinceDate: date_time_string
  removingDate: _nullish | date_time_string
}
type permissionsOnMoodlenetContributor = flags<'follow' | 'sendMessage' | 'report' | 'editProfileInfo'>

export type moodlenetContributorMinimalInfo = {
  id: moodlenetContributorId
  slug: string
  displayName: string
  avatar: _nullish | asset
  points: non_negative_integer
}

export type moodlenetContributorAccessObject = {
  moodlenetContributorId: moodlenetContributorId
  profileInfo: moodlenetContributorProfileExcerpt['info']
  itsMe: boolean
  contributions: moodlenetContributions
  linkedContent: Pick<linkedContent, 'following' | 'likes'>
  permissions: permissionsOnMoodlenetContributor
  stats: {
    points: non_negative_integer
    // followersCount: non_negative_integer
  }
}
