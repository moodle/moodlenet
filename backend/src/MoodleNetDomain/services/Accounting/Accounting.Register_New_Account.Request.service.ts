import { MoodleNet } from '../..'
import { getAccountPersistence } from './accounting.env'
import { accountingRoutes } from './AcountingRoutes'

MoodleNet.respondApi({
  api: 'Accounting.Register_New_Account.Request',
  async handler({ flow, req }) {
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
        flow: accountingRoutes.reflow(flow, 'Register_New_Account_Email_Confirmation'),
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
