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
    const resp = await persistence.addNewAccountRequest({ req, flow })
    if (resp === true) {
      await MoodleNet.callApi({
        api: 'Email.Verify_Email.Req',
        flow: detour(verifyEmailResultBinding),
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
      return { success: true } as const
    } else {
      return { success: false, reason: resp } //as const
    }
  },
})

const verifyEmailResultBinding = MoodleNet.bindApi({
  event: 'Email.Verify_Email.Result',
  api: 'Accounting.Register_New_Account.Email_Confirm_Result',
})
