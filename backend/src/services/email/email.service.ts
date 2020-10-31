import {
  enqueVerifyEmailTokenExpired,
  makeSendEmailWorker,
  makeVerifyEmailWorker,
  makeVerifyEmailTokenExpiredWorker,
} from './email.queues'
import { persistence, sender } from './email.service.env'
import { uuid } from './helpers'
import { EmailService, SendEmailObj } from './types'

const emailService: EmailService = {
  name: 'email',
  actions: {
    checkverifyEmail: {
      async handler(ctx) {
        return persistence.checkVerifyEmail({ ...ctx.params })
      },
    },
  },
  created() {
    makeSendEmailWorker(async (job) => {
      const sendRes = await sender.sendEmail(job.json)
      await persistence.storeSentEmail({ jobId: job.properties.messageId, res: sendRes })
      return sendRes
    })

    makeVerifyEmailTokenExpiredWorker(async (job) => {
      await persistence.deleteVerifyingEmail({
        ...job.json,
      })
      return {
        verified: true,
        email: job.json.email,
      }
    })

    makeVerifyEmailWorker(async (job, progress, forward) => {
      const token = uuid()
      const mailObj = {
        ...job.json.mailObj,
        html: replaceVerifyEmailLinkPlaceholder(job.json.mailObj.html, token),
        text: replaceVerifyEmailLinkPlaceholder(job.json.mailObj.text, token),
      }
      const email = job.json.mailObj.to
      const { expirationTime } = job.json

      const sendObj: SendEmailObj = { ...mailObj, to: [email] }
      const sendRes = await sender.sendEmail(sendObj)
      const expireDate = new Date(new Date().valueOf() + expirationTime)

      const [] = await Promise.all([
        persistence.storeSentEmail({ jobId: job.properties.messageId, res: sendRes }),
        persistence.storeSentVerifyEmail({
          jobId: job.properties.messageId,
          token,
          expireDate,
          email,
          verifiedAt: null,
        }),
      ])

      forward(
        enqueVerifyEmailTokenExpired,
        job,
        { email, token, type: 'VerifyEmailProgressStarted' },
        {
          expiration: expirationTime,
        }
      )

      progress(job, {
        type: 'VerifyEmailProgressStarted',
        token: token,
        email,
      })
    })
  },
}

const replaceVerifyEmailLinkPlaceholder = (body: string | undefined, token: string) =>
  body?.replace(/\$\{VERIFY_EMAIL_TOKEN\}/g, token)
module.exports = emailService
