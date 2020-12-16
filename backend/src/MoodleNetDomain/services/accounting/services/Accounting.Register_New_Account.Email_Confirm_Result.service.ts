import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../Accounting.env'
import { accountingRoutes } from '../Accounting.routes'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
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
  await accountingRoutes.bind({
    event: 'Email.Verify_Email.Result',
    api: 'Accounting.Register_New_Account.Email_Confirm_Result',
    route: 'Register_New_Account',
  })
})
