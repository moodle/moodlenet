import { MoodleNet } from '../../..'
import { Register_New_Account_Delete_Request_Api_Handler } from '../apis/UserAccount.Register_New_Account.Delete_Request'

Register_New_Account_Delete_Request_Api_Handler().then((handler) => {
  MoodleNet.respondApi({
    api: 'UserAccount.Register_New_Account.Delete_Request',
    handler,
  })
})
