import { any_, date_time_string } from '@moodle/lib-types'
import { userId } from '../../userHome.model'

export type authSession = {
  id: string
  userId: userId
  envelope: Pick<moo.def.model.envelope<any_>, 'id' | 'origin' | 'callTime'>
  expires: date_time_string
  //CHECK: add role here to be maintained for user role change (for policy retrieve performance)
  // role: userRole

  // policiesRevDate: date_time_string
  // token: signed_token
}
