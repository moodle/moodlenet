import { date_time_string, non_negative_integer } from '@moodle/lib-types'
import { userProfileId } from '../../user-profile'
import { moodlenetContributorId } from './moodlenet-contributor'

type reportType = string //TODO: type:desc map in moodlenet Configs?
type reportAbuseForm = {
  type: reportType
  comment: string | undefined
}
type reportAbuseItem = {
  date: date_time_string
  reporterUserProfileId: userProfileId
  reason: reportAbuseForm
}

export type moodlenetContributorModerations = {
  moodlenetContributorId: moodlenetContributorId
  reports: {
    items: reportAbuseItem[]
    amount: non_negative_integer
  }
}
