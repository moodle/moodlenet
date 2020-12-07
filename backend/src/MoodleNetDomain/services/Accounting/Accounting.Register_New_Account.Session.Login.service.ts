import { MoodleNet } from '../..'
import { getAccountPersistence, verifyPassword } from './accounting.env'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'Accounting.Session.Login',
    async handler({ flow, req: { username, password: pwd } }) {
      const account = await accountPersistence.getAccountByUsername({
        username,
      })
      if (!account) {
        return { success: false }
      }
      const paswordMatches = await verifyPassword({ hash: account.password, pwd })
      if (!paswordMatches) {
        return { success: false }
      }

      MoodleNet.emitEvent({
        event: 'Accounting.Session.AccountLoggedIn',
        flow,
        payload: { username },
      })

      return { success: true }
    },
  })
})
