import { d_u, date_time_string, positive_integer } from '@moodle/lib-types'
import { draft_id } from '../../user-home/types/drafts'
import { publishedContentType, published_content_id, userContributionType, user_contribution_id } from './content'
import { userModerations } from './moderation'

export type moodlenetUserData = {
  preferences: {
    useMyInterestsAsDefaultFilters?: boolean
  }
  featuredContent: {
    bookmarked: myFeaturedContent<'edu-resource' | 'edu-resource-collection'>[]
    following: myFeaturedContent<'user-home' | 'isced-field' | 'edu-resource-collection'>[]
    liked: myFeaturedContent<'edu-resource'>[]
  }
  published: {
    contributions: myPublishedContribution[]
  }
  points: {
    amount: positive_integer
  }
  userModerationStatus: userModerations
}
export type myFeaturedContent<ctype extends publishedContentType> = {
  type: ctype
  id: published_content_id
  at: date_time_string
}

export type myPublishedContribution = {
  type: userContributionType
  myDraftId: draft_id
  publishedId: user_contribution_id
} & d_u<
  {
    published: unknown
    unpublished: { at: date_time_string }
  },
  'status'
>
