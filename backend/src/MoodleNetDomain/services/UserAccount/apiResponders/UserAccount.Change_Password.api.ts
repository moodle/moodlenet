import { MoodleNet } from '../../..'
import { Change_Password_Api_Handler } from '../apis/UserAccount.Change_Password'

Change_Password_Api_Handler().then(async (handler) => {
  MoodleNet.respondApi({
    api: 'UserAccount.Change_Password',
    handler,
  })
})
