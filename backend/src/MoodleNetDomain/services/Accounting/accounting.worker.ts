import { MoodleNet } from '../..'
import { sender } from '../Email/email.service.env'
import { accountPersistence } from './accounting.env'

MoodleNet.api.respond({
  api: 'Accounting.Register_New_Account.Request',
  async handler({ flowId, req }) {
    await accountPersistence().addNewAccountRequest({ req, flowId })

    await MoodleNet.api.call({
      api: 'Email.Verify_Email.Req',
      flowId,
      req: {
        timeoutHours: 0.03,
        email: {
          to: req.email,
          from: 'Bob <bob@host.com>',
          subject: 'verify',
          text: 'amamamam ${token}',
        },
        maxAttempts: 3,
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

MoodleNet.api.respond({
  api: 'Email.Send_One.Req',
  async handler({ /* flowId, */ req }) {
    const resp = await sender.sendEmail(req.emailObj)
    if (resp.success) {
      //TODO: emit event
    }
    return resp
  },
})
