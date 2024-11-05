import { date_time_string, non_negative_integer } from '@moodle/lib-types'
import { moodlenetContributorId } from './contributor'

export type moodlenetPublicContributionMeta = {
  moodlenetContributorId: moodlenetContributorId
  firstMoodlenetPublicationDate: date_time_string
  lastMoodlenetPublicationDate: date_time_string
  stats: {
    // viewCount: non_negative_integer
    recalculatedDate: date_time_string
    popularity: non_negative_integer
  }
}

export type moodlenetPublicContentRecord<recordType> = recordType & {
  meta: moodlenetPublicContributionMeta
}
