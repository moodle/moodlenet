import { Config } from '../../persistence/types'
import { changeAccountEmailRequestEmailTEXT } from './changeAccountEmailRequestEmail'
import { newAccountRequestEmailTEXT } from './newAccountRequestEmail'

export const DefaultConfig: Config = {
  createdAt: 1606513900934, //2020-11-27T21:51:40.934Z
  sendEmailConfirmationAttempts: 2,
  sendEmailConfirmationDelay: 120000, // 2 * 24 * 60 * 60 * 1000,
  newAccountRequestEmail: {
    text: newAccountRequestEmailTEXT,
    from: 'Bob <bob@example.com>',
    subject: 'please confirm your email',
  },
  changeAccountEmailRequestEmail: {
    text: changeAccountEmailRequestEmailTEXT,
    from: 'Bob <bob@example.com>',
    subject: 'please confirm your email',
  },
}
