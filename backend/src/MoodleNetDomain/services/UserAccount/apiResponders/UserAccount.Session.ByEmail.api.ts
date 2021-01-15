import { MoodleNet } from '../../..'
import { SessionByEmailApiHandler } from '../apis/UserAccount.Session.ByEmail'

SessionByEmailApiHandler().then((handler) => {
  MoodleNet.respondApi({
    api: 'UserAccount.Session.ByEmail',
    handler,
  })
})
