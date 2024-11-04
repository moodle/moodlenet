import { moodlenetContributorAccessObject } from '../../../../moodlenet/types'

export type profilePageData = {
  moodlenetContributorAccessObject: moodlenetContributorAccessObject
  stats: {
    followersCount: number
    followingCount: number
    publishedResourcesCount: number
  }
  // flags:flags<'isContributor'>
}
