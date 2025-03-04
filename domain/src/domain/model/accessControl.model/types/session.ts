import { any_, date_time_string } from '@moodle/lib-types'

export type authSession = {
  envelope: Pick<moo.model.envelope<any_>, 'id' | 'origin' | 'callTime'>
  expires: date_time_string
  // permissionsRevDate: date_time_string
  // token: signed_token
}
