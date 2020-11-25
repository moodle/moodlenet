import { MoodleNet } from '../..'
import { accountPersistence } from './accounting.env'

MoodleNet.api.responder({
  api: 'Accounting.Register_New_Account.Request',
  async handler({ flowId, req }) {
    await accountPersistence().addNewAccountRequest({ req, flowId })

    await MoodleNet.api.call({
      api: 'Email.Verify_Email.Req',
      flowId,
      req: {
        timeoutHours: 0.1,
        email: {
          to: req.email,
          from: 'Bob <bob@host.com>',
          subject: 'verify',
          text: 'amamamam ${token}',
        },
        maxAttempts: 2,
        tokenReplaceRegEx: '${token}',
      },
      opts: { noReply: true },
    })
    await MoodleNet.event.bindToApi({
      event: 'Email.Verify_Email.Result',
      api: 'Accounting.Register_New_Account.Email_Confirm_Result',
      tag: flowId._tag,
    })
    return {}
  },
})

MoodleNet.api.responder({
  api: 'Accounting.Register_New_Account.Email_Confirm_Result',
  async handler({ disposeThisBinding, flowId, req }) {
    disposeThisBinding()
    if (req.success) {
      const acc = await accountPersistence().activateNewAccount({ flowId })
      if (!acc) {
        return { done: false }
      }
      await MoodleNet.event.emit({
        event: 'Accounting.Register_New_Account.AccountActivated',
        payload: { flowId },
        flowId,
      })
      return { done: true }
    } else {
      await accountPersistence().removeNewAccountRequest({ flowId })
      return { done: true }
    }
  },
})
