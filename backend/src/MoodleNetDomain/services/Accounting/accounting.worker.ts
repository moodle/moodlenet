import { MoodleNet } from '../..'
import { accountPersistence } from './accounting.env'

MoodleNet.consume({
  target: 'Accounting.Register_New_Account_Request',
  async handler({ payload: req }) {
    const accKey = await accountPersistence.addNewAccountRequest({ req })

    MoodleNet.publish({
      target: 'Email.Verify_Email',
      payload: { key: accKey, email: { to: req.email }, maxAttempts: 2, tokenReplaceRegEx: '' },
    })

    // TODO: i forward vogliono solo KeyedTopic con stesso key ?
    // TODO: i KeyedTopic ricevono sempre Type&{key: string} ? .. no .. Email.Verify_Email riceve il key in questo caso
    MoodleNet.forward({
      source: ['Email.Verify_Email_Result', accKey],
      target: ['Accounting.New_Account_Email_Confirm_Result', accKey],
    })
  },
})
