import { MoodleNet } from '../../..'
import { User_Create_For_New_Account_Api_Handler } from '../apis/ContentGraph.User.Create_For_New_Account.api'
import { contentGraphRoutes } from '../ContentGraph.routes'

User_Create_For_New_Account_Api_Handler().then((handler) => {
  MoodleNet.respondApi({
    api: 'ContentGraph.User.Create_For_New_Account',
    handler,
  })
  contentGraphRoutes.bind({
    event: 'UserAccount.Register_New_Account.New_Account_Activated',
    route: '*',
    api: 'ContentGraph.User.Create_For_New_Account',
  })
})
