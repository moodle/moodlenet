import { UserCreateForNewAccountApiHandler } from '../apis/ContentGraph.User.CreateForNewAccount.api'
import { contentGraphRoutes } from '../ContentGraph.routes'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { api } from '../../../../lib/domain'

api<MoodleNetDomain>()('ContentGraph.User.CreateForNewAccount').respond(
  UserCreateForNewAccountApiHandler
)
contentGraphRoutes.bind({
  event: 'UserAccount.RegisterNewAccount.NewAccountActivated',
  route: '*',
  api: 'ContentGraph.User.CreateForNewAccount',
})
