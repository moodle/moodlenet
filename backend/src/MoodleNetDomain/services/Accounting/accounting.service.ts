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
      return { success: true } as const
    } else {
      return { success: false, reason: resp } //as const
    }
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
      return { done: true }
    } else {
      await (await getAccountPersistence()).newAccountRequestExpired({ flow })
      return { done: true }
    }
  },
})

MoodleNet.respondApi({
  api: 'Accounting.Register_New_Account.ActivateNewAccount',
  async handler({ flow, req: { requestFlowKey, password, username } }) {
    const maybeAccount = await (await getAccountPersistence()).activateNewAccount({
      requestFlowKey,
      password,
      username,
    })
    if (typeof maybeAccount === 'string') {
      return { success: false, reason: maybeAccount } as const
    }
    MoodleNet.emitEvent({
      event: 'Accounting.AccountActivated',
      flow,
      payload: { requestFlowKey: maybeAccount.requestFlowKey },
    })
    return { success: true } as const
  },
})
