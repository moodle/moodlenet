import { MoodleNet } from '../../..'
import { getVerifiedAccountByUsername, signJwt } from '../UserAccount.helpers'

MoodleNet.respondApi({
  api: 'UserAccount.Session.Create',
  async handler({ /* flow, */ req: { username, password } }) {
    const account = await getVerifiedAccountByUsername({
      username,
      password,
    })

    if (!account) {
      return { auth: null }
    }

    const jwt = await signJwt({ account })

    return { auth: { userAccount: account, jwt } }
  },
})
