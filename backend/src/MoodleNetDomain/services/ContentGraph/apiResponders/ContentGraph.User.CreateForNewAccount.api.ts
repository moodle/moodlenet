import { MoodleNet } from '../../..'
import { UserCreateForNewAccountApiHandler } from '../apis/ContentGraph.User.CreateForNewAccount.api'
import { contentGraphRoutes } from '../ContentGraph.routes'

MoodleNet.api('ContentGraph.User.CreateForNewAccount').respond(
  UserCreateForNewAccountApiHandler
)
contentGraphRoutes.bind({
  event: 'UserAccount.RegisterNewAccount.NewAccountActivated',
  route: '*',
  api: 'ContentGraph.User.CreateForNewAccount',
})
