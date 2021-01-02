import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../UserAccount.env'
import { signJwt, verifyPassword } from '../UserAccount.helpers'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'UserAccount.Session.Login',
    async handler({ flow, req: { username, password: pwd } }) {
      const account = await accountPersistence.getAccountByUsername({
        username,
      })
      if (!account) {
        return { jwt: null }
      }
      const paswordMatches = await verifyPassword({
        hash: account.password,
        pwd,
      })
      if (!paswordMatches) {
        return { jwt: null }
      }
      const cfg = await accountPersistence.getConfig()
      const jwt = signJwt({
        //FIXME
        payload: {
          username: account.username,
          accountId: account.username,
          userId: account.username,
        },
        opts: {
          expiresIn: cfg.sessionValiditySecs,
        },
      })
      MoodleNet.emitEvent({
        event: 'UserAccount.Session.AccountLoggedIn',
        flow,
        payload: { username, jwt },
      })

      return { jwt }
    },
  })
})
