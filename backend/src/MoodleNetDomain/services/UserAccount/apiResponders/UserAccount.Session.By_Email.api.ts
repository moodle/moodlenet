import { MoodleNet } from '../../..'
import { Session_By_Email_Api_Handler } from '../apis/UserAccount.Session.By_Email'

Session_By_Email_Api_Handler().then((handler) => {
  MoodleNet.respondApi({
    api: 'UserAccount.Session.By_Email',
    handler,
  })
})
