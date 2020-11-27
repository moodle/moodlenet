import { Config } from '../../persistence/types'
import { newAccountRequestEmailTEXT } from './newAccountRequestEmail'

export const DefaultConfig: Config = {
  createdAt: 1606513900934, //2020-11-27T21:51:40.934Z
  sendEmailConfirmationAttempts: 2,
  newAccountRequestEmail: {
    text: newAccountRequestEmailTEXT,
    from: 'Moodlenet <info@moodle.net>',
    subject: 'please confirm your email',
  },
}
