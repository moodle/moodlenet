import { UserAuthConfig } from '../../impl/arango/types'
import { changeUserEmailRequestEmail } from './changeUserEmailRequestEmail'
import { newUserRequestEmail } from './newUserRequestEmail'
import { tempSessionEmail } from './tempSessionEmail'

export const DefaultConfig: UserAuthConfig = {
  createdAt: 1606513900934, //2020-11-27T21:51:40.934Z
  newUserRequestEmail: {
    ...newUserRequestEmail,
    from: 'Bob <bob@example.com>',
    subject: 'please confirm your email',
  },
  changeUserEmailRequestEmail: {
    ...changeUserEmailRequestEmail,
    from: 'Bob <bob@example.com>',
    subject: 'please confirm your new email',
  },
  tempSessionEmail: {
    ...tempSessionEmail,
    from: 'Bob <bob@example.com>',
    subject: 'reset password',
  },
  newUserVerificationWaitSecs: 2 * 24 * 60 * 60,
  changeUserEmailVerificationWaitSecs: 2 * 24 * 60 * 60,
}
