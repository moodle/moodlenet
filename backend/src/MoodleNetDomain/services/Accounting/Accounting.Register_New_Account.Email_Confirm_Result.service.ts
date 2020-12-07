import { MoodleNet } from '../..'
import { getAccountPersistence } from './accounting.env'

getAccountPersistence().then((accountPersistence) => {
  MoodleNet.respondApi({
    api: 'Accounting.Register_New_Account.Email_Confirm_Result',
    async handler({ flow, req }) {
      if (req.success) {
        const confirmResp = await accountPersistence.confirmNewAccountRequest({ flow })
        if (confirmResp === 'Request Not Found') {
          return { done: false }
        }
        return { done: true }
      } else {
        await accountPersistence.newAccountRequestExpired({ flow })
        return { done: true }
      }
    },
  })
})
