import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../UserAccount.env'
import { hashPassword } from '../UserAccount.helpers'

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
        return { success: false, reason: maybeAccount } as const
      } else {
        MoodleNet.emitEvent({
          event: 'UserAccount.Register_New_Account.NewAccountActivated',
          flow,
          payload: { accountId: maybeAccount._id },
        })
        return { success: true } as const
      }
    },
  })
})
