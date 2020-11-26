import { MoodleNet } from '../..'
import { newUuid } from '../../../lib/helpers/misc'
import { emailPersistence } from './email.service.env'
import { EmailObj } from './types'

MoodleNet.api.respond({
  api: 'Email.Verify_Email.Req',
  async handler({ req, flowId }) {
    const { email, tokenReplaceRegEx } = req
    const token = `${newUuid()}|${flowId._key}`
    const regex = new RegExp(tokenReplaceRegEx, 'g')
    const emailObj: EmailObj = {
      ...email,
      html: email.html?.replace(regex, token),
      text: email.text?.replace(regex, token),
    }
    const documentKey = await emailPersistence().storeVerifyingEmail({
      req: {
        ...req,
        email: emailObj,
      },
      flowId,
      token,
    })
    MoodleNet.api.call({
      api: 'Email.Verify_Email.Attempt_Send',
      req: {},
      flowId: flowId,
    })
    return { id: documentKey }
  },
})

MoodleNet.api.respond({
  api: 'Email.Verify_Email.Attempt_Send',
  async handler({ flowId }) {
    const document = await emailPersistence().incAttemptVerifyingEmail({ flowId })
    console.log(`Email.Verify_Email.Attempt_Send`, flowId._key, flowId._tag, document?.attempts)
    if (!document) {
      return { success: false, error: 'Not Found' }
    }
    if (document.req.maxAttempts <= document.attempts) {
      MoodleNet.event.emit({
        event: 'Email.Verify_Email.Result',
        flowId,
        payload: {
          email: document.req.email.to,
          error: `Max attempts [${document.req.maxAttempts}] timeout`,
          success: false,
        },
      })
    } else {
      await MoodleNet.api.call({
        api: 'Email.Send_One.Req',
        req: { emailObj: document.req.email },
        flowId,
      })

      MoodleNet.api.call({
        api: 'Email.Verify_Email.Attempt_Send',
        flowId,
        req: {},
        opts: {
          delay: Math.round(document.req.timeoutHours * 60 * 60 * 1000),
        },
      })
    }
    return { success: true } as const
  },
})

MoodleNet.api.respond({
  api: 'Email.Verify_Email.Confirm_Email',
  async handler({ req: { token } }) {
    const doc = await emailPersistence().confirmEmail({ token })
    if (doc) {
      MoodleNet.event.emit({
        event: 'Email.Verify_Email.Result',
        flowId: { _tag: doc._tag, _key: doc._key },
        payload: { email: doc.req.email.to, success: true },
      })
    }
    return doc ? ({ success: true } as const) : { error: `couldn't find`, success: false }
  },
})
