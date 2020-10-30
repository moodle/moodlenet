import { ServiceQueue } from '../../queue'
import {
  EmailService,
  SendEmailObj,
  SendEmailResult,
  VerifyEmailProgress,
  VerifyEmailReq,
  VerifyEmailStarted,
} from './types'

const makeQueue = ServiceQueue<EmailService>('email')

export const [sendEmailQueue, enqueSendEmail, makeSendEmailWorker] = makeQueue<
  SendEmailObj,
  SendEmailResult
>('send')

export const [verifyEmailQueue, enqueVerifyEmail, makeVerifyEmailWorker] = makeQueue<
  VerifyEmailReq,
  VerifyEmailProgress
>('verify')

export const [
  verifyEmailTokenExpiredQueue,
  enqueVerifyEmailTokenExpired,
  makeVerifyEmailTokenExpiredWorker,
] = makeQueue<VerifyEmailStarted, VerifyEmailProgress>('verify_token_expired')
