import { UserAuthConfig } from '../../../adapters/user-auth/arangodb/types'
import { changeUserEmailRequestEmail } from './changeUserEmailRequestEmail'
import { newUserRequestEmail } from './newUserRequestEmail'
import { tempSessionEmail } from './tempSessionEmail'

export const DefaultConfig: UserAuthConfig = {
  createdAt: 1606513900934, //2020-11-27T21:51:40.934Z
  newUserRequestEmail: {
    ...newUserRequestEmail,
    from: 'Moodlenet <noreply@moodle.net>',
    subject: 'please confirm your email',
  },
  changeUserEmailRequestEmail: {
    ...changeUserEmailRequestEmail,
    from: 'Moodlenet <noreply@moodle.net>',
    subject: 'please confirm your new email',
  },
  tempSessionEmail: {
    ...tempSessionEmail,
    from: 'Moodlenet <noreply@moodle.net>',
    subject: 'reset password',
  },
  newUserVerificationWaitSecs: 2 * 24 * 60 * 60,
  changeUserEmailVerificationWaitSecs: 2 * 24 * 60 * 60,
}
