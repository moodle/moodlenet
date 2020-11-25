import { MoodleNet } from '../..'
import { accountPersistence } from './accounting.env'

MoodleNet.api.respond({
  api: 'Accounting.Register_New_Account.Request',
  async handler({ flowId, req }) {
    await accountPersistence().addNewAccountRequest({ req, flowId })

    await MoodleNet.api.call({
      api: 'Email.Verify_Email.Req',
      flowId,
      req: {
        timeoutHours: 0.002,
        email: {
          to: req.email,
          from: 'Bob <bob@host.com>',
          subject: 'verify',
          text: 'amamamam ${token}',
        },
        maxAttempts: 1,
        tokenReplaceRegEx: '${token}',
      },
      opts: { noReply: true },
    })
    await MoodleNet.event.bindToApi({
      event: 'Email.Verify_Email.Result',
      api: 'Accounting.Register_New_Account.Email_Confirm_Result',
      tag: flowId._tag, //TODO: _key or _tag ?
    })
    return {}
  },
})

MoodleNet.api.respond({
  api: 'Accounting.Register_New_Account.Email_Confirm_Result',
  async handler({ disposeThisBinding, flowId, req }) {
    console.log(`Accounting.Register_New_Account.Email_Confirm_Result`, flowId._key, flowId._tag)
    console.log(1)
    disposeThisBinding()
    console.log(2)
    if (req.success) {
      console.log(3)
      const acc = await accountPersistence().activateNewAccount({ flowId })
      console.log(4)
      if (!acc) {
        console.log(5)
        return { done: false }
      }
      await MoodleNet.event.emit({
        event: 'Accounting.Register_New_Account.AccountActivated',
        payload: { flowId },
        flowId,
      })
      console.log(6)
      return { done: true }
    } else {
      console.log(10)
      await accountPersistence().removeNewAccountRequest({ flowId })
      console.log(11)
      return { done: true }
    }
  },
})
