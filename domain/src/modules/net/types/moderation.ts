import { date_time_string, non_negative_integer } from '@moodle/lib-types'
import { userAccountId } from '../../user-account'

export type reportType = string //TODO: type:desc map in net Configs?
export type reportAbuseForm = {
  type: reportType
  comment: string | undefined
}
export type reportAbuseItem = {
  date: date_time_string
  reporter: userAccountId
  reason: reportAbuseForm
}

export type userModerations = {
  reports: {
    items: reportAbuseItem[]
    amount: non_negative_integer
  }
}
