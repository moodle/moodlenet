import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../UserAccount.env'
import { hashPassword } from '../UserAccount.helpers'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'UserAccount.Register_New_Account.ActivateNewAccount',
    async handler({
      flow,
      req: { requestFlowKey, password: plainPassword, username },
    }) {
      const hashedPassword = await hashPassword({ pwd: plainPassword })
      const maybeAccount = await accountPersistence.activateNewAccount({
        requestFlowKey,
        password: hashedPassword,
        username,
      })
      if (typeof maybeAccount === 'string') {
        return { success: false, reason: maybeAccount } as const
      }
      MoodleNet.emitEvent({
        event: 'UserAccount.Register_New_Account.NewAccountActivated',
        flow,
        payload: { requestFlowKey: maybeAccount.requestFlowKey },
      })
      return { success: true } as const
    },
  })
})
