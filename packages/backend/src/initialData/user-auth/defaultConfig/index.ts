import { UserAuthConfig } from '@moodlenet/common/lib/user-auth/types'
import { newUserRequestEmail } from './newUserRequestEmail'

export const DefaultConfig: UserAuthConfig = {
  newUserRequestEmail: {
    ...newUserRequestEmail,
    from: 'Moodlenet <noreply@moodle.net>',
    subject: 'please confirm your email',
  },
  newUserVerificationWaitSecs: 2 * 24 * 60 * 60,
}
