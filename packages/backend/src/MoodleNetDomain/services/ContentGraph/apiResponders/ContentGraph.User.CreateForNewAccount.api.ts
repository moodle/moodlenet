import { api } from '../../../../lib/domain'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { UserCreateForNewAccountApiHandler } from '../apis/ContentGraph.User.CreateForNewAccount.api'

api<MoodleNetDomain>()('ContentGraph.User.CreateForNewAccount').respond(UserCreateForNewAccountApiHandler)

// invoked directly in UserAccount#ConfirmEmailActivateAccountApiHandler
//
// contentGraphRoutes.bind({
//   event: 'UserAccount.RegisterNewAccount.NewAccountActivated',
//   route: '*',
//   api: 'ContentGraph.User.CreateForNewAccount',
// })
