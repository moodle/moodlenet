import {
  enqueVerifyTimeoutEmail,
  makeSendEmailWorker,
  makeVerifyEmailWorker,
  makeVerifyTimeoutEmailWorker,
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

    makeVerifyTimeoutEmailWorker(async (job) => {
      return persistence.deleteVerifyingEmail({
        ...job.data,
      })
    })

    makeVerifyEmailWorker(async (job) => {
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

      enqueVerifyTimeoutEmail(
        `Email Verification Timeout:${email}[${job.id}]`,
        { email, token },
        {
          delay: expirationTime,
          linkTo: job,
        }
      )

      return {
        verifyToken: token,
      }
    })
  },
}

const replaceVerifyEmailLinkPlaceholder = (body: string | undefined, token: string) =>
  body?.replaceAll('${VERIFY_EMAIL_TOKEN}', token)

module.exports = emailService
