import { MoodleNet } from '../..'
import { newUuid } from '../../../lib/helpers/misc'
import { emailPersistence } from './email.service.env'
import { EmailObj } from './types'

MoodleNet.consume({
  target: ['Email.Verify_Email.Req'],
  async handler({ payload }) {
    const { email, tokenReplaceRegEx, timeoutHours } = payload
    const token = newUuid()
    const regex = new RegExp(tokenReplaceRegEx, 'g')
    const emailObj: EmailObj = {
      ...email,
      html: email.html?.replace(regex, token),
      text: email.text?.replace(regex, token),
    }
    const req = {
      ...payload,
      emailObj,
    }
    const documentKey = await emailPersistence().storeVerifyingEmail({ req })
    MoodleNet.publish({
      target: ['Email.Verify_Email.Attempt_Send'],
      payload: { first: true, documentKey },
      opts: {
        delay: timeoutHours * 60 * 60 * 1000,
      },
    })
    return { id: documentKey }
  },
})

MoodleNet.consume({
  target: ['Email.Verify_Email.Attempt_Send'],
  async handler({ payload: { documentKey, first } }) {
    const document = await emailPersistence().incAttemptVerifyingEmail({ key: documentKey })
    if (!document) {
      return
    }
    if (!first && document.req.maxAttempts <= document.attempts) {
      MoodleNet.publish({
        target: ['Accounting.Register_New_Account.Email_Confirm_Result', document.req.key],
        payload: {
          email: document.req.email.to,
          error: `Max attempts [${document.req.maxAttempts}] timeout`,
          success: false,
        },
      })
    } else {
      MoodleNet.publish({
        target: ['Email.Send_One.Req'],
        payload: { emailObj: document.req.email },
      })

      MoodleNet.publish({
        target: ['Email.Verify_Email.Attempt_Send'],
        payload: { first: false, documentKey },
        opts: {
          delay: document.req.timeoutHours * 60 * 60 * 1000,
        },
      })
    }
  },
})
