import { any_, date_time_string } from '@moodle/lib-types'
import { userId } from '../../userAccount.model'

export type authSession = {
  id: string
  userId: userId
  envelope: Pick<moo.model.envelope<any_>, 'id' | 'origin' | 'callTime'>
  expires: date_time_string
  //CHECK: add role here to be maintained for user role change (for permission retrieve performance)
  // role: userRole

  // permissionsRevDate: date_time_string
  // token: signed_token
}
