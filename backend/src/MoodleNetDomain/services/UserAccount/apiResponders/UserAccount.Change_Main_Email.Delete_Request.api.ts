import { MoodleNet } from '../../..'
import { Change_Account_Email_Delete_Request_Api_Handler } from '../apis/UserAccount.Change_Main_Email.Delete_Request'

Change_Account_Email_Delete_Request_Api_Handler().then((handler) => {
  MoodleNet.respondApi({
    api: 'UserAccount.Change_Main_Email.Delete_Request',
    handler,
  })
})
