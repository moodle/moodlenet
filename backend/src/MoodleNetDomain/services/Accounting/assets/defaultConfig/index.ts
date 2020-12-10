import { Config } from '../../persistence/types'
import { changeAccountEmailRequestEmail } from './changeAccountEmailRequestEmail'
import { newAccountRequestEmail } from './newAccountRequestEmail'
import { tempSessionEmail } from './tempSessionEmail'

export const DefaultConfig: Config = {
  createdAt: 1606513900934, //2020-11-27T21:51:40.934Z
  sendEmailConfirmationAttempts: 2,
  sendEmailConfirmationDelaySecs: 120, // 2 * 24 * 60 * 60 ,
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
  resetPasswordSessionValiditySecs: 120, // 2 * 24 * 60 * 60 ,
  sessionValiditySecs: 120, // 2 * 24 * 60 * 60 ,
}
