import { MoodleNet } from '../../..'
import { Change_Account_Email_Request_Api_Handler } from '../apis/UserAccount.Change_Main_Email.Request.'

Change_Account_Email_Request_Api_Handler().then((handler) => {
  MoodleNet.respondApi({
    api: 'UserAccount.Change_Main_Email.Request',
    handler,
  })
})
