import { _nullish, non_negative_integer } from '@moodle/lib-types'
import { moodlenetContributorAccessObject, moodlenetContributorId } from '../../../moodlenet/types'
import { asset } from '../../../storage'

export type moodlenetContributorMinimalInfo = {
  id: moodlenetContributorId
  slug: string
  displayName: string
  avatar: asset
  points: non_negative_integer
}
export type moodlenetContributorInfo = {
  moodlenetContributorAccessObject: moodlenetContributorAccessObject
  stats: { followersCount: number; followingCount: number; publishedResourcesCount: number }
}
