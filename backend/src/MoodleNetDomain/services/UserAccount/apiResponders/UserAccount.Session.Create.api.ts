import { MoodleNet } from '../../..'
import { SessionCreateApiHandler } from '../apis/UserAccount.Session.Create'

SessionCreateApiHandler().then((handler) => {
  MoodleNet.respondApi({
    api: 'UserAccount.Session.Create',
    handler,
  })
})
