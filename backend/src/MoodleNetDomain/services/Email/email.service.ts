import { MoodleNet } from '../..'
import { newUuid } from '../../../lib/helpers/misc'
import { getEmailPersistence, getSender } from './email.env'
import { EmailObj } from './types'

MoodleNet.respondApi({
  api: 'Email.Verify_Email.Req',
  async handler({ req, flow }) {
    const { email, tokenReplaceRegEx } = req
    const token = `${newUuid()}|${flow._key}`
    const regex = new RegExp(tokenReplaceRegEx, 'g')
    const emailObj: EmailObj = {
      ...email,
      html: email.html?.replace(regex, token),
      text: email.text?.replace(regex, token),
    }
    const documentKey = await (await getEmailPersistence()).storeVerifyingEmail({
      req: {
        ...req,
        email: emailObj,
      },
      flow,
      token,
    })
    MoodleNet.callApi({
      api: 'Email.Verify_Email.Attempt_Send',
      req: {},
      flow: flow,
    })
    return { id: documentKey }
  },
})

MoodleNet.respondApi({
  api: 'Email.Verify_Email.Attempt_Send',
  async handler({ flow }) {
    const document = await (await getEmailPersistence()).incAttemptVerifyingEmail({ flow })
    console.log(`Email.Verify_Email.Attempt_Send`, flow._key, flow._route, document?.attempts)
    if (!document) {
      return { success: false, error: 'Not Found' }
    }
    if (document.req.maxAttempts <= document.attempts) {
      MoodleNet.emitEvent({
        event: 'Email.Verify_Email.Result',
        flow,
        payload: {
          email: document.req.email.to,
          error: `Max attempts [${document.req.maxAttempts}] timeout`,
          success: false,
        },
      })
    } else {
      await MoodleNet.callApi({
        api: 'Email.Send_One.Req',
        req: { emailObj: document.req.email },
        flow,
      })

      MoodleNet.callApi({
        api: 'Email.Verify_Email.Attempt_Send',
        flow,
        req: {},
        opts: {
          justEnqueue: true,
          delay: Math.round(document.req.timeoutHours * 60 * 60 * 1000),
        },
      })
    }
    return { success: true } as const
  },
})

MoodleNet.respondApi({
  api: 'Email.Verify_Email.Confirm_Email',
  async handler({ req: { token } }) {
    const doc = await (await getEmailPersistence()).confirmEmail({ token })
    if (doc) {
      MoodleNet.emitEvent({
        event: 'Email.Verify_Email.Result',
        flow: { _route: doc._route, _key: doc._key },
        payload: { email: doc.req.email.to, success: true },
      })
    }
    return doc ? ({ success: true } as const) : { error: `couldn't find`, success: false }
  },
})

MoodleNet.respondApi({
  api: 'Email.Send_One.Req',
  async handler({ flow, req }) {
    const resp = await (await getSender()).sendEmail(req.emailObj)
    MoodleNet.emitEvent({
      event: 'Email.Send_One.SentEmail',
      flow,
      payload: resp,
    })
    return resp
  },
})
