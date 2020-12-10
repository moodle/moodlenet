import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../accounting.env'
import { hashPassword } from '../accounting.helpers'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'Accounting.Register_New_Account.ActivateNewAccount',
    async handler({ flow, req: { requestFlowKey, password: plainPassword, username } }) {
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
        event: 'Accounting.Register_New_Account.NewAccountActivated',
        flow,
        payload: { requestFlowKey: maybeAccount.requestFlowKey },
      })
      return { success: true } as const
    },
  })
})
