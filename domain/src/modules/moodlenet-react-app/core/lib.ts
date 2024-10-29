import { moodlenetContributorRecord } from '../../moodlenet/types'
import { moodlenetContributorMinimalInfo } from '../types'

export function mapContributorToMinimalInfo(
  moodlenetContributorRecord: moodlenetContributorRecord,
): moodlenetContributorMinimalInfo {
  return {
    id: moodlenetContributorRecord.id,
    slug: moodlenetContributorRecord.slug,
    displayName: moodlenetContributorRecord.userProfile.info.displayName,
    avatar: moodlenetContributorRecord.userProfile.info.avatar,
    points: moodlenetContributorRecord.stats.points,
  }
}
