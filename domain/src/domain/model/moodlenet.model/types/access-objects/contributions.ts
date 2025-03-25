import { date_time_string, i_nat } from '@moodle/lib-types'
import { moodlenetContributorId } from './contributor'

export type moodlenetPublicContributionMeta = {
  moodlenetContributorId: moodlenetContributorId
  firstMoodlenetPublicationDate: date_time_string
  lastMoodlenetPublicationDate: date_time_string
  stats: {
    // viewCount: i_nat
    recalculatedDate: date_time_string
    popularity: i_nat
  }
}

export type moodlenetPublicContentRecord<recordType> = recordType & {
  meta: moodlenetPublicContributionMeta
}
