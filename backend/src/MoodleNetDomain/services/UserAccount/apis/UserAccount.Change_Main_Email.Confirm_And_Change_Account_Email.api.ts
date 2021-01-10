import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../UserAccount.env'
import { getVerifiedAccountByUsername } from '../UserAccount.helpers'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'UserAccount.Change_Main_Email.Confirm_And_Change_Account_Email',
    async handler({ req: { token, password, username } }) {
      const account = await getVerifiedAccountByUsername({
        username,
        password,
      })

      if (!account) {
        return { done: false }
      }
      const confirmError = await accountPersistence.confirmAccountEmailChangeRequest(
        { token }
      )
      if (confirmError) {
        return { done: false }
      } else {
        return { done: true }
      }
    },
  })
})
