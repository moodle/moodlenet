import { d_u, date_time_string, non_negative_integer } from '@moodle/lib-types'
import { draft_id } from '../../user-profile/types/drafts'
import { publishedContentType, published_content_id, userContributionType, user_contribution_id } from './content'

export type userProfileMoodlenetData = {
  preferences: {
    useMyInterestsAsDefaultFilters?: boolean
  }
  featuredContent: {
    bookmarked: myFeaturedContent<'edu-resource' | 'edu-resource-collection'>[]
    following: myFeaturedContent<'user-profile' | 'isced-field' | 'edu-resource-collection'>[]
    liked: myFeaturedContent<'edu-resource'>[]
  }
  suggestedContent: userProfileSuggestions
  published: {
    contributions: myPublishedContribution[]
  }
  points: {
    amount: non_negative_integer
  }
}

export type userProfileSuggestions = {
  listsCreationDate: date_time_string
  userProfiles: myFeaturedContent<'user-profile'>[]
  eduResourceCollections: myFeaturedContent<'edu-resource-collection'>[]
  eduResources: myFeaturedContent<'edu-resource'>[]
}

export type myFeaturedContent<ctype extends publishedContentType> = {
  type: ctype
  id: published_content_id
  date: date_time_string
}

export type myPublishedContribution = {
  type: userContributionType
  myDraftId: draft_id
  publishedId: user_contribution_id
} & d_u<
  {
    published: unknown
    unpublished: { date: date_time_string }
  },
  'status'
>
