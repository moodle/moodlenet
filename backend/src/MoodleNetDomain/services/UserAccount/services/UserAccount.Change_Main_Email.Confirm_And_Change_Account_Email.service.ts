import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../UserAccount.env'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'UserAccount.Change_Main_Email.Confirm_And_Change_Account_Email',
    async handler({ req: { token, password } }) {
      const confirmError = await accountPersistence.confirmAccountEmailChangeRequest(
        { token, password }
      )
      if (confirmError) {
        return { done: false }
      } else {
        return { done: true }
      }
    },
  })
})
