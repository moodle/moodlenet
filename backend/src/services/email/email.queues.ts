import { ServiceQueue } from '../../lib/queue'
import { SendEmailJobReq, SendEmailProgress } from './types'
import { EmailService } from './types/service'

const { makeServiceQueue } = ServiceQueue<EmailService>('email')

export const sendEmailWF = makeServiceQueue<SendEmailJobReq, SendEmailProgress>('send')
