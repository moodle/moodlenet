import { MoodleNet } from '../../..'
import { ChangePasswordApiHandler } from '../apis/UserAccount.ChangePassword'

ChangePasswordApiHandler().then(async (handler) => {
  MoodleNet.respondApi({
    api: 'UserAccount.ChangePassword',
    handler,
  })
})
