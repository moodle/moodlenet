import { MoodleNet } from '../../..'
import { ApiReturn } from '../../../../lib/domain/api/types'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { getEmailPersistence } from '../Email.env'

getEmailPersistence().then(async (emailPersistence) => {
  await MoodleNet.respondApi({
    api: 'Email.Verify_Email.Attempt_Send',
    async handler({
      flow,
    }): ApiReturn<MoodleNetDomain, 'Email.Verify_Email.Attempt_Send'> {
      const doc = await emailPersistence.incrementAttemptVerifyingEmail({
        flow,
      })
      if (!doc) {
        return { success: false, error: 'Not Found' }
      } else if (doc.status === 'Verified') {
        return { success: true }
      } else if (doc.status === 'Expired') {
        MoodleNet.emitEvent({
          event: 'Email.Verify_Email.Result',
          flow,
          payload: {
            email: doc.req.email.to,
            error: `Max attempts [${doc.req.maxAttempts}] expired`,
            success: false,
          },
        })

        return { success: true }
      } else if (doc.status === 'Verifying') {
        await MoodleNet.callApi({
          api: 'Email.Send_One.Req',
          req: { emailObj: doc.req.email },
          flow,
        })

        MoodleNet.callApi({
          api: 'Email.Verify_Email.Attempt_Send',
          flow,
          req: {},
          opts: {
            justEnqueue: true,
            delaySecs: doc.req.timeoutSecs,
          },
        })

        return { success: true }
      } else {
        return { success: false, error: `Unknown current status ${doc.status}` }
      }
    },
  })
})
