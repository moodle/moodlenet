import { MoodleNet } from '../../..'
import { RegisterNewAccountRequestApiHandler } from '../apis/UserAccount.RegisterNewAccount.Request'

RegisterNewAccountRequestApiHandler().then((handler) => {
  MoodleNet.respondApi({
    api: 'UserAccount.RegisterNewAccount.Request',
    handler,
  })
})
