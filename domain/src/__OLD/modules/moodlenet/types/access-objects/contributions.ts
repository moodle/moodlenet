import { date_time_string, nat_int } from '@moodle/lib-types'
import { moodlenetContributorId } from './contributor'

export type moodlenetPublicContributionMeta = {
  moodlenetContributorId: moodlenetContributorId
  firstMoodlenetPublicationDate: date_time_string
  lastMoodlenetPublicationDate: date_time_string
  stats: {
    // viewCount: nat_int
    recalculatedDate: date_time_string
    popularity: nat_int
  }
}

export type moodlenetPublicContentRecord<recordType> = recordType & {
  meta: moodlenetPublicContributionMeta
}
