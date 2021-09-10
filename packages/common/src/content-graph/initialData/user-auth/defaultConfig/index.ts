import { newUserRequestEmail } from './newUserRequestEmail'
import { recoverPasswordEmail } from './recoverPasswordEmail'

export const DefaultConfig = {
  newUserRequestEmail: {
    ...newUserRequestEmail,
    from: 'Moodlenet <noreply@moodle.net>',
    subject: 'please confirm your email',
  },
  newUserVerificationWaitSecs: 2 * 24 * 60 * 60,
  recoverPasswordEmail: {
    ...recoverPasswordEmail,
    from: 'Moodlenet <noreply@moodle.net>',
    subject: 'change your password',
  },
  recoverPasswordEmailExpiresSecs: 2 * 60 * 60,
}
