import { i_nat } from '@moodle/lib-types'
import { moodlenetContributorAccessObject, moodlenetContributorId } from '../../../moodlenet/types'
import { maybeAsset } from '../../../storage'

export type moodlenetContributorMinimalInfo = {
  id: moodlenetContributorId
  slug: string
  displayName: string
  avatar: maybeAsset
  points: i_nat
}
export type moodlenetContributorInfo = {
  moodlenetContributorAccessObject: moodlenetContributorAccessObject
  stats: { followersCount: number; followingCount: number; publishedResourcesCount: number }
}
