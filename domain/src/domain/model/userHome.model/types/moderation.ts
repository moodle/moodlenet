import { date_time_string } from '@moodle/lib-types'
import { userId } from '../../userAccount.model'

export type userReportItem<form> = {
  date: date_time_string
  reporterUserId: userId
  reportForm: form
}
