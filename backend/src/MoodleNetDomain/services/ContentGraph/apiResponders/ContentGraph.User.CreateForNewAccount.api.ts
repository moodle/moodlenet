import { MoodleNet } from '../../..'
import { UserCreateForNewAccountApiHandler } from '../apis/ContentGraph.User.CreateForNewAccount.api'
import { contentGraphRoutes } from '../ContentGraph.routes'

UserCreateForNewAccountApiHandler().then((handler) => {
  MoodleNet.respondApi({
    api: 'ContentGraph.User.CreateForNewAccount',
    handler,
  })
  contentGraphRoutes.bind({
    event: 'UserAccount.RegisterNewAccount.NewAccountActivated',
    route: '*',
    api: 'ContentGraph.User.CreateForNewAccount',
  })
})
