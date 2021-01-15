import { MoodleNet } from '../../..'
import { Confirm_Email_Activate_Account_Api_Handler } from '../apis/UserAccount.Register_New_Account.Activate_New_Account'

Confirm_Email_Activate_Account_Api_Handler().then((handler) => {
  MoodleNet.respondApi({
    api: 'UserAccount.Register_New_Account.Confirm_Email_Activate_Account',
    handler,
  })
})
