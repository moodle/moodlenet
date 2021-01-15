import { MoodleNet } from '../../..'
import { RegisterNewAccountDeleteRequestApiHandler } from '../apis/UserAccount.RegisterNewAccount.DeleteRequest'

RegisterNewAccountDeleteRequestApiHandler().then((handler) => {
  MoodleNet.respondApi({
    api: 'UserAccount.RegisterNewAccount.DeleteRequest',
    handler,
  })
})
