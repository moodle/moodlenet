import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../UserAccount.env'
import { signJwt, verifyPassword } from '../UserAccount.helpers'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'UserAccount.Session.Create',
    async handler({ /* flow, */ req: { username, password } }) {
      const account = await accountPersistence.getActiveAccountByUsername({
        username,
      })
      if (!account) {
        return { auth: null }
      }
      const paswordMatches = await verifyPassword({
        hash: account.password,
        pwd: password,
      })

      if (!paswordMatches) {
        return { auth: null }
      }

      const jwt = await signJwt({ account })

      return { auth: { userAccount: account, jwt } }
    },
  })
})
