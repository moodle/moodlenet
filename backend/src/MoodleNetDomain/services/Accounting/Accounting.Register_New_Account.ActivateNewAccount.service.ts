import { MoodleNet } from '../..'
import { getAccountPersistence } from './accounting.env'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'Accounting.Register_New_Account.ActivateNewAccount',
    async handler({ flow, req: { requestFlowKey, password, username } }) {
      const maybeAccount = await accountPersistence.activateNewAccount({
        requestFlowKey,
        password,
        username,
      })
      if (typeof maybeAccount === 'string') {
        return { success: false, reason: maybeAccount } as const
      }
      MoodleNet.emitEvent({
        event: 'Accounting.AccountActivated',
        flow,
        payload: { requestFlowKey: maybeAccount.requestFlowKey },
      })
      return { success: true } as const
    },
  })
})
