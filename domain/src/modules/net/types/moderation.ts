import { non_negative_integer } from '@moodle/lib-types'
import { userId } from '../../iam'

export type reportType = string //TODO: type:desc map in net Configs?
export type reportAbuseForm = {
  type: reportType
  comment: string | undefined
}
export type reportAbuseItem = {
  date: string
  reporter: userId
  reason: reportAbuseForm
}

export type userModerations = {
  reports: {
    items: reportAbuseItem[]
    amount: non_negative_integer
  }
}
