import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../UserAccount.env'
import { hashPassword, signJwt } from '../UserAccount.helpers'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'UserAccount.Register_New_Account.Confirm_Email_Activate_Account',
    async handler({ flow, req: { token, password, username } }) {
      const hashedPassword = await hashPassword({ pwd: password })
      const maybeAccount = await accountPersistence.activateNewAccount({
        token,
        username,
        password: hashedPassword,
      })
      if (typeof maybeAccount === 'string') {
        return { auth: null }
      } else {
        const { username, _id } = maybeAccount
        const jwt = await signJwt({ account: maybeAccount })
        MoodleNet.emitEvent({
          event: 'UserAccount.Register_New_Account.NewAccountActivated',
          flow,
          payload: { accountId: _id, username },
        })

        return { auth: { jwt, userAccount: maybeAccount } }
      }
    },
  })
})
