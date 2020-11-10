import { uuid } from '../../lib/helpers/misc'
import { AnyProgressOf } from '../../lib/queue/types'
import { sendEmailWF } from '../email/email.queues'
import { RegisterNewAccountWF, VerifyEmailWF } from './accounting.queues'
import { env, persistence } from './accounting.service.env'
import { AccountingService, RegisterNewAccountProgress, VerifyEmailJobProgress } from './types'

const VERIFY_FIRST_REGISTRATION_EMAIL = 'Verify first registration email'
// const VERIFY_ACCOUNT_NEW_EMAIL = 'Verify acount new email'

const accountingService: AccountingService = {
  name: 'accounting',
  actions: {
    confirmAccountEmail: {
      async handler(ctx) {
        const job = await persistence.confirmVerifyEmail({
          email: ctx.params.email,
          token: ctx.params.token,
        })
        if (!job) {
          return null
        }
        VerifyEmailWF.sendVerificationEmailProgress.enqueue(
          job.name,
          { _state: 'Confirmed' },
          {
            correlationId: job.id,
          }
        )
        return job
      },
    },
  },
  created() {
    RegisterNewAccountWF.newRegistrationVerificationEmailProgress.consume(
      async (job, progress, _forward) => {
        if (job.json._state === 'Aborted' || job.json._state === 'Expired') {
          persistence.deleteAccountRegistrationRequest({ jobId: job.jobId })
          progress(job, {
            _state: 'Rejected',
            reason:
              job.json._state === 'Aborted'
                ? job.json.reason
                : `mail verification expired after ${job.json.attemptCount} attempt`,
          })
        } else if (job.json._state === 'Confirmed') {
          persistence.activateAccount({ jobId: job.jobId })
          progress(job, { _state: 'AccountActivated' })
        } else if (job.json._state === 'Waiting') {
          persistence.activateAccount({ jobId: job.jobId })
          progress(job, { _state: 'WaitingConfirmEmail' })
        }
      }
    )
    RegisterNewAccountWF.registerNewAccount.consume(async (job, progress, _forward) => {
      const confirmEmailJob = await VerifyEmailWF.verifyAccountEmail.enqueue(
        VERIFY_FIRST_REGISTRATION_EMAIL,
        {
          email: job.json.email,
        },
        {
          progress: RegisterNewAccountWF.newRegistrationVerificationEmailProgress.enqueue,
          correlationId: job.jobId,
        }
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

    VerifyEmailWF.sendVerificationEmailProgress.consume(async (job, progress, _forward) => {
      if (job.json._state === 'SendEmailProgressKO' || job.json._state === 'Expired') {
        const progressData: AnyProgressOf<VerifyEmailJobProgress> =
          job.json._state === 'Expired'
            ? {
                _state: 'Expired',
                attemptCount: job.json.attemptCount,
              }
            : {
                _state: 'Aborted',
                reason: `Couldn't send email`,
              }
        persistence.updateVerifyEmailProgress({
          jobId: job.jobId,
          progress: progressData,
        })
        progress(job, progressData)
      } else if (job.json._state === 'Confirmed') {
        progress(job, job.json)
      }
    })

    VerifyEmailWF.verifyAccountEmail.consume(async (job, progress, forward) => {
      const attemptCount = (job.json.attemptCount || 0) + 1
      if (attemptCount > env.emailVerificationAttempts) {
        forward(VerifyEmailWF, 'sendVerificationEmailProgress', job, {
          _state: 'Expired',
          attemptCount: attemptCount - 1,
        })
        return
      }

      const token = uuid()
      const expirationTimeMillis = env.emailVerificationExpiresDays * 24 * 60 * 60 * 1000

      const emailJob = await sendEmailWF.enqueue(
        job.jobName,
        {
          from: 'emailfrom <emailfrom@example.com>',
          subject: 'Verify',
          to: job.json.email,
          text: `verify ${token}`,
        },
        { progress: VerifyEmailWF.sendVerificationEmailProgress.enqueue, correlationId: job.jobId }
      )

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
