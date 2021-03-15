import { UserAccountConfig } from '../../impl/arango/types'
import { changeAccountEmailRequestEmail } from './changeAccountEmailRequestEmail'
import { newAccountRequestEmail } from './newAccountRequestEmail'
import { tempSessionEmail } from './tempSessionEmail'

export const DefaultConfig: UserAccountConfig = {
  createdAt: 1606513900934, //2020-11-27T21:51:40.934Z
  newAccountRequestEmail: {
    ...newAccountRequestEmail,
    from: 'Bob <bob@example.com>',
    subject: 'please confirm your email',
  },
  changeAccountEmailRequestEmail: {
    ...changeAccountEmailRequestEmail,
    from: 'Bob <bob@example.com>',
    subject: 'please confirm your new email',
  },
  tempSessionEmail: {
    ...tempSessionEmail,
    from: 'Bob <bob@example.com>',
    subject: 'reset password',
  },
  newAccountVerificationWaitSecs: 2 * 24 * 60 * 60,
  changeAccountEmailVerificationWaitSecs: 2 * 24 * 60 * 60,
}
