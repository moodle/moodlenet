import { d_u, date_time_string, non_negative_integer } from '@moodle/lib-types'
import { draftId } from '../../user-profile/types/drafts'
import { publicContentType, publicContentId, userContributionType, userContributionId } from './content'

export type userProfileMoodlenetData = {
  preferences: {
    useMyInterestsAsDefaultFilters: boolean
  }
  featuredContent: featuredContent[]
  suggestedContent: {
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

export type suggestedContent = {
  type: publicContentType
  publicContentId: publicContentId
}

export type featuredContent = {
  type: publicContentType
  publicContentId: publicContentId
  date: date_time_string
} & d_u<{ unpublished: unknown; published: unknown }, 'status'>

export type myPublishedContribution = {
  type: userContributionType
  myDraftId: draftId
  userContributionId: userContributionId
  lastPublished: { date: date_time_string }
} & d_u<{ unpublished: { date: date_time_string }; published: unknown }, 'status'>
