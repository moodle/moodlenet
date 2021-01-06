import { MoodleNet } from '../../..'
import { getContentGraphPersistence } from '../ContentGraph.env'
import { contentGraphRoutes } from '../ContentGraph.routes'

getContentGraphPersistence().then(({ createUser }) => {
  MoodleNet.respondApi({
    api: 'ContentGraph.User.Create_For_New_Account',
    async handler({ req: { username } }) {
      const user = await createUser({ username })
      return { newUser: user }
    },
  })
  contentGraphRoutes.bind({
    event: 'UserAccount.Register_New_Account.NewAccountActivated',
    route: '*',
    api: 'ContentGraph.User.Create_For_New_Account',
  })
})
