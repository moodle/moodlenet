import { date_time_string, i_nat } from '@moodle/lib-types'
import { userId } from '../../userHome.model'

type reportType = string //TODO: type:desc map in moodlenet Configs?
type reportAbuseForm = {
  type: reportType
  comment: string | undefined
}
type reportAbuseItem = {
  date: date_time_string
  reporterUserId: userId
  reason: reportAbuseForm
}

export type moodlenetContributorModerations = {
  userId: userId
  reports: {
    items: reportAbuseItem[]
    amount: i_nat
  }
}
