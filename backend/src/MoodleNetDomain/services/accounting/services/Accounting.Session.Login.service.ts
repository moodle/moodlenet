import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../Accounting.env'
import { signJwt, verifyPassword } from '../Accounting.helpers'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'Accounting.Session.Login',
    async handler({ flow, req: { username, password: pwd } }) {
      const account = await accountPersistence.getAccountByUsername({
        username,
      })
      if (!account) {
        return { jwt: null }
      }
      const paswordMatches = await verifyPassword({ hash: account.password, pwd })
      if (!paswordMatches) {
        return { jwt: null }
      }
      const cfg = await accountPersistence.config()
      const jwt = signJwt({
        payload: { username: account.username },
        opts: {
          expiresIn: cfg.sessionValiditySecs,
        },
      })
      MoodleNet.emitEvent({
        event: 'Accounting.Session.AccountLoggedIn',
        flow,
        payload: { username, jwt },
      })

      return { jwt }
    },
  })
})
