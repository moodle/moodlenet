import { MoodleNet } from '../..'
import { getAccountPersistence } from './accounting.env'
import { accountingRoutes } from './Accounting.routes'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'Accounting.Change_Main_Email.Email_Confirm_Result',
    async handler({ flow, req }) {
      if (req.success) {
        const confirmResp = await accountPersistence.confirmAccountEmailChangeRequest({ flow })
        if (confirmResp === 'Request Not Found') {
          return { done: false }
        }
        return { done: true }
      } else {
        await accountPersistence.changeAccountEmailRequestExpired({ flow })
        return { done: true }
      }
    },
  })
  await accountingRoutes.bind({
    event: 'Email.Verify_Email.Result',
    api: 'Accounting.Change_Main_Email.Email_Confirm_Result',
    route: 'Change_Account_Email',
  })
})
