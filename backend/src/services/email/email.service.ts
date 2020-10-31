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
      const sendRes = await sender.sendEmail(job.data)
      await persistence.storeSentEmail({ jobId: job.id, res: sendRes })
      return sendRes
    })

    makeVerifyEmailTokenExpiredWorker(async (job) => {
      await persistence.deleteVerifyingEmail({
        ...job.data,
      })
      return {
        verified: true,
        email: job.data.email,
      }
    })

    makeVerifyEmailWorker(async (job, forward) => {
      const token = uuid()
      const mailObj = {
        ...job.data.mailObj,
        html: replaceVerifyEmailLinkPlaceholder(job.data.mailObj.html, token),
        text: replaceVerifyEmailLinkPlaceholder(job.data.mailObj.text, token),
      }
      const email = job.data.mailObj.to
      const { expirationTime } = job.data

      const sendObj: SendEmailObj = { ...mailObj, to: [email] }
      const sendRes = await sender.sendEmail(sendObj)
      const expireDate = new Date(new Date().valueOf() + expirationTime)

      const [] = await Promise.all([
        persistence.storeSentEmail({ jobId: job.id, res: sendRes }),
        persistence.storeSentVerifyEmail({
          jobId: job.id,
          token,
          expireDate,
          email,
          verifiedAt: null,
        }),
      ])

      forward(
        enqueVerifyEmailTokenExpired,
        job,
        `Email Verification Timeout:${email}[${job.id}]`,
        { email, token },
        {
          delay: expirationTime,
        }
      )

      return {
        token: token,
        email,
      }
    })
  },
}

const replaceVerifyEmailLinkPlaceholder = (body: string | undefined, token: string) =>
  body?.replace(/\$\{VERIFY_EMAIL_TOKEN\}/g, token)
    
module.exports = emailService
