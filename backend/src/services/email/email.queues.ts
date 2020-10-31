import { ServiceQueue } from '../../queue'
import {
  EmailService,
  SendEmailObj,
  SendEmailProgress,
  VerifyEmailProgress,
  VerifyEmailReq,
  VerifyEmailProgressStarted,
} from './types'

const makeQueue = ServiceQueue<EmailService>('email')

export const [enqueSendEmail, makeSendEmailWorker] = makeQueue<SendEmailObj, SendEmailProgress>(
  'send'
)

export const [enqueVerifyEmail, makeVerifyEmailWorker] = makeQueue<
  VerifyEmailReq,
  VerifyEmailProgress
>('verify')

export const [enqueVerifyEmailTokenExpired, makeVerifyEmailTokenExpiredWorker] = makeQueue<
  VerifyEmailProgressStarted,
  VerifyEmailProgress
>('verify_token_expired')
