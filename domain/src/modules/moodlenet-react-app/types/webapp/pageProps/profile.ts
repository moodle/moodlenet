import { moodlenetContributorAccessObject } from '../../../../moodlenet/types'

export type profilePageProps = {
  moodlenetContributorAccessObject: moodlenetContributorAccessObject
  stats: {
    followersCount: number
    followingCount: number
    publishedResourcesCount: number
  }
  // flags:flags<'isContributor'>
}
