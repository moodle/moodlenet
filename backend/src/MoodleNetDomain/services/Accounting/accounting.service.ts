import { MoodleNet } from '../..'
import { getAccountPersistence } from './accounting.env'

MoodleNet.respondApi({
  api: 'Accounting.Register_New_Account.Request',
  async handler({ flow, req, detour }) {
    const persistence = await getAccountPersistence()
    const config = await persistence.config()
    const {
      newAccountRequestEmail,
      sendEmailConfirmationAttempts,
      sendEmailConfirmationDelay,
    } = config
    await persistence.addNewAccountRequest({ req, flow })
    await MoodleNet.callApi({
      api: 'Email.Verify_Email.Req',
      flow: detour('Accounting.Register_New_Account.Email_Confirm_Result'),
      req: {
        timeoutMillis: sendEmailConfirmationDelay,
        email: {
          to: req.email,
          from: newAccountRequestEmail.from,
          subject: newAccountRequestEmail.subject,
          text: newAccountRequestEmail.text,
        },
        maxAttempts: sendEmailConfirmationAttempts,
        tokenReplaceRegEx: '__TOKEN__',
      },
      opts: { justEnqueue: true },
    })
    return {}
  },
})

MoodleNet.bindApi({
  event: 'Email.Verify_Email.Result',
  api: 'Accounting.Register_New_Account.Email_Confirm_Result',
})

MoodleNet.respondApi({
  api: 'Accounting.Register_New_Account.Email_Confirm_Result',
  async handler({ flow, req }) {
    if (req.success) {
      const acc = await (await getAccountPersistence()).confirmNewAccountRequest({ flow })
      if (!acc) {
        return { done: false }
      }
      await MoodleNet.emitEvent({
        event: 'Accounting.Register_New_Account.AccountActivated',
        payload: { flow },
        flow,
      })
      return { done: true }
    } else {
      await (await getAccountPersistence()).newAccountRequestExpired({ flow })
      return { done: true }
    }
  },
})
