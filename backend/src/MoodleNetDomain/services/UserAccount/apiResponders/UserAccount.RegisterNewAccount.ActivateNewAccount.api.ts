import { MoodleNet } from '../../..'
import { ConfirmEmailActivateAccountApiHandler } from '../apis/UserAccount.RegisterNewAccount.ActivateNewAccount'

ConfirmEmailActivateAccountApiHandler().then((handler) => {
  MoodleNet.respondApi({
    api: 'UserAccount.RegisterNewAccount.ConfirmEmailActivateAccount',
    handler,
  })
})
