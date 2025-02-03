import { email_address } from '@moodle/lib-types'
import * as moo from 'moodle-domain'

export type userAccount = moo.DefService<{
  model: moo.DefModel<UserAccountModel>
}>

export interface UserAccountModel {
  user: moo.IdSpaceMap<
    {
      email: email_address
      secure: { passwordHash: string }
      profileInfo: moo.EntityData<
        'w',
        {
          displayName: string
        }
      >
    },
    {
      emailEquals: string
    },
    {
      a: ['async', null, null]
    }
  >
}
