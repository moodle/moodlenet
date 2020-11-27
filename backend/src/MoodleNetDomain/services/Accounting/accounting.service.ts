import { MoodleNet } from '../..'
import { accountPersistence } from './accounting.env'

MoodleNet.respondApi({
  api: 'Accounting.Register_New_Account.Request',
  async handler({ flow, req, detour }) {
    await (await accountPersistence).addNewAccountRequest({ req, flow })

    await MoodleNet.callApi({
      api: 'Email.Verify_Email.Req',
      flow: detour('Accounting.Register_New_Account.Email_Confirm_Result'),
      req: {
        timeoutHours: 0.006,
        email: {
          to: req.email,
          from: 'Bob <bob@host.com>',
          subject: 'verify',
          text: 'amamamam __TOKEN__',
        },
        maxAttempts: 3,
        tokenReplaceRegEx: '__TOKEN__',
      },
      opts: { noReply: true },
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
    console.log(`Accounting.Register_New_Account.Email_Confirm_Result`, flow._key, flow._route)
    if (req.success) {
      const acc = await (await accountPersistence).activateNewAccount({ flow })
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
      await (await accountPersistence).removeNewAccountRequest({ flow })
      return { done: true }
    }
  },
})
