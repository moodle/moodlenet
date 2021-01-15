import { MoodleNet } from '../../..'
import { Session_Create_Api_Handler } from '../apis/UserAccount.Session.Create'

Session_Create_Api_Handler().then((handler) => {
  MoodleNet.respondApi({
    api: 'UserAccount.Session.Create',
    handler,
  })
})
