import { MoodleNet } from '../../..'
import { Confirm_And_Change_Account_Email_Handler } from '../apis/UserAccount.Change_Main_Email.Confirm_And_Change_Account_Email'

Confirm_And_Change_Account_Email_Handler().then((handler) => {
  MoodleNet.respondApi({
    api: 'UserAccount.Change_Main_Email.Confirm_And_Change_Account_Email',
    handler,
  })
})
