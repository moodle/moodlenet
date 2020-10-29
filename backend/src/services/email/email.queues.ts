import { ServiceQueue } from '../../queue'
import {
  EmailService,
  SendEmailObj,
  SendEmailResult,
  VerifyEmailReq,
  VerifyEmailResult,
  VerifyTimeoutEmailReq,
  VerifyTimeoutEmailResult,
} from './types'

const makeQueue = ServiceQueue<EmailService>('email')

export const [sendEmailQueue, enqueSendEmail, makeSendEmailWorker] = makeQueue<
  SendEmailObj,
  SendEmailResult
>('send')

export const [verifyEmailQueue, enqueVerifyEmail, makeVerifyEmailWorker] = makeQueue<
  VerifyEmailReq,
  VerifyEmailResult
>('verify')

export const [
  verifyTimeoutQueue,
  enqueVerifyTimeoutEmail,
  makeVerifyTimeoutEmailWorker,
] = makeQueue<VerifyTimeoutEmailReq, VerifyTimeoutEmailResult>('verify_timeout')
