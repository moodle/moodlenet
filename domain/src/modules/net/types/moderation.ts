import { non_negative_integer } from '@moodle/lib-types'
import { user_id } from '../../iam'

export type reportType = string //TODO: type:desc map in net Configs?
export type reportAbuseForm = {
  type: reportType
  comment: string | undefined
}
export type reportAbuseItem = {
  date: string
  reporter: user_id
  reason: reportAbuseForm
}

export type userModerations = {
  reports: {
    items: reportAbuseItem[]
    amount: non_negative_integer
  }
}
