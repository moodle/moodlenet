import { Organization } from '../../../types/node'
import { newUserRequestEmail } from './newUserRequestEmail'
import { recoverPasswordEmail } from './recoverPasswordEmail'
import { sendMessageToUserEmail } from './sendMessageToUserEmail'

export const DefaultConfig = (org: Organization) => ({
  newUserRequestEmail: {
    ...newUserRequestEmail,
    from: `${org.name} <noreply@${org.domain}>`,
    subject: 'Confirm your email',
  },
  newUserVerificationWaitSecs: 2 * 24 * 60 * 60,
  recoverPasswordEmail: {
    ...recoverPasswordEmail,
    from: `${org.name} <noreply@${org.domain}>`,
    subject: 'Change your password',
  },
  recoverPasswordEmailExpiresSecs: 2 * 60 * 60,
  messageToUserEmail: {
    ...sendMessageToUserEmail,
    from: `${org.name} <noreply@${org.domain}>`,
    subject: '{{=it.senderName}} sent you a message!',
  },
})
