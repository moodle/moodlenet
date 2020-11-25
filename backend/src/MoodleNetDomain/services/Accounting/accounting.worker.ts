import { MoodleNet } from '../..'
import { accountPersistence } from './accounting.env'

MoodleNet.consume({
  target: ['Accounting.Register_New_Account.Request'],
  async handler({ payload: request }) {
    const accKey = await accountPersistence().addNewAccountRequest({ request })

    MoodleNet.publish({
      target: ['Email.Verify_Email.Req'],
      payload: {
        timeoutHours: 0.1,
        key: accKey,
        email: {
          to: request.email,
          from: '',
          subject: '',
          text: '',
        },
        maxAttempts: 2,
        tokenReplaceRegEx: '',
      },
    })

    MoodleNet.forward({
      source: 'Email.Verify_Email.Result',
      key: accKey,
      target: 'Accounting.Register_New_Account.Email_Confirm_Result',
    })
  },
})

MoodleNet.consume({
  target: ['Accounting.Register_New_Account.Email_Confirm_Result', '*'],
  async handler({ payload, key }) {
    if (payload.success) {
      const acc = await accountPersistence().activateNewAccount({ key })
      if (!acc) {
        return
      }
      MoodleNet.publish({
        target: ['Accounting.Register_New_Account.AccountActivated'],
        payload: { accountKey: key },
      })
    } else {
      await accountPersistence().removeNewAccountRequest({ key })
    }
    return
  },
})
