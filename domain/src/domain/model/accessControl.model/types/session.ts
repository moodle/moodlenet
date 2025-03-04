import { any_, date_time_string, signed_token } from '@moodle/lib-types'

export type authSession = {
  permissionsRev: string
  createdDate: date_time_string
  validUntilDate: date_time_string
  token: signed_token
  request: moo.core.request<any_>
}
