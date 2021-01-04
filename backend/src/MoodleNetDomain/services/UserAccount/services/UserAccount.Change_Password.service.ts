import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../UserAccount.env'
import { hashPassword, verifyPassword } from '../UserAccount.helpers'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'UserAccount.Change_Password',
    async handler({ req: { newPassword, username, currentPassword } }) {
      const account = await accountPersistence.getActiveAccountByUsername({
        username,
      })

      if (!account) {
        return { success: false, reason: 'not found' }
      }

      const pwdVerified = await verifyPassword({
        hash: account.password,
        pwd: currentPassword,
      })

      if (!pwdVerified) {
        return { success: false, reason: 'wrong pwd' }
      }

      const currentPasswordHash = await hashPassword({ pwd: currentPassword })
      const newPasswordHash = await hashPassword({ pwd: newPassword })

      const changePwdError = await accountPersistence.changePassword({
        accountId: account._id,
        currentPassword: currentPasswordHash,
        newPassword: newPasswordHash,
      })
      if (changePwdError) {
        return { success: false, reason: changePwdError }
      } else {
        return { success: true } as const
      }
    },
  })
})
