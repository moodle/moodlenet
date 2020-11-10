import { uuid } from '../../lib/helpers/misc'
import { AnyProgressOf } from '../../lib/queue'
import { sendEmailWF } from '../email/email.queues'
import { RegisterNewAccountWF, VerifyEmailWF } from './accounting.queues'
import { env, persistence } from './accounting.service.env'
import { AccountingService, RegisterNewAccountProgress, VerifyEmailJobProgress } from './types'

const accountingService: AccountingService = {
  name: 'accounting',
  actions: {
    confirmAccountEmail: {
      async handler(ctx) {
        return persistence.confirmVerifyEmail({ email: ctx.params.email, token: ctx.params.token })
      },
    },
  },
  created() {
    RegisterNewAccountWF.registerNewAccount.consume(async (job, progress, _forward) => {
      const confirmEmailJob = await VerifyEmailWF.verifyAccountEmail.enqueue(
        'Verify first registration email',
        {
          email: job.json.email,
        },
        { progress: RegisterNewAccountWF.sendVerificationEmailProgress.enqueue }
      )

      const progressData: AnyProgressOf<RegisterNewAccountProgress> = {
        _state: 'WaitingConfirmEmail',
      }
      await persistence.saveAccountRegistrationRequestJob({
        jobId: job.jobId,
        confirmEmailJob,
        progress: { _state: 'WaitingConfirmEmail' },
        req: job.json,
      })
      progress(job, progressData)
    })

    RegisterNewAccountWF.sendVerificationEmailProgress.consume(async (job, progress, _forward) => {
      if (job.json._state === 'Confirmed') {
        persistence.activateAccount({ jobId: job.jobId })
        progress(job, { _state: 'AccountActivated' })
      } else if (
        job.json._state === 'Expired' &&
        job.json.attemptCount >= env.emailVerificationAttempts
      ) {
        progress(job, {
          _state: 'Rejected',
          reason: `no confirmation after ${job.json.attemptCount} attempts`,
        })
      } else if (job.json._state === 'Waiting') {
        progress(job, { _state: 'WaitingConfirmEmail' })
      }
    })

    VerifyEmailWF.verifyAccountEmail.consume(async (job, progress, forward) => {
      const attemptCount = (job.json.attemptCount || 0) + 1
      if (attemptCount > env.emailVerificationAttempts) {
        forward(VerifyEmailWF, 'cancelAccountVerifyEmailJob', job, null)
        return
      }
      const token = uuid()
      const expirationTimeMillis = env.emailVerificationExpiresDays * 24 * 60 * 60 * 1000

      const emailJob = await sendEmailWF.enqueue('verify an account email', {
        from: 'emailfrom <emailfrom@example.com>',
        subject: 'Verify',
        to: job.json.email,
        text: `verify ${token}`,
      })

      const progressData: AnyProgressOf<VerifyEmailJobProgress> = {
        _state: 'Waiting',
        attemptCount,
      }
      const expireDate = new Date(new Date().valueOf() + expirationTimeMillis)
      await persistence.saveVerifyEmailJob({
        jobId: job.jobId,
        req: job.json,
        sendEmailJob: emailJob,
        expireDate,
        progress: progressData,
      })
      progress(job, progressData)

      forward(
        VerifyEmailWF,
        'verifyAccountEmail',
        job,
        { ...job.json, attemptCount },
        {
          expiration: expirationTimeMillis,
        }
      )
    })
  },
}

// const replaceVerifyAccountingLinkPlaceholder = (body: string | undefined, token: string) =>
//   body?.replace(/\$\{VERIFY_ACCOUNTING_TOKEN\}/g, token)
module.exports = accountingService
export default accountingService
