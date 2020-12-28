import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../UserAccount.env'
import { userAccountRoutes } from '../UserAccount.routes'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'UserAccount.Change_Main_Email.Email_Confirm_Result',
    async handler({ flow, req }) {
      if (req.success) {
        const confirmResp = await accountPersistence.confirmAccountEmailChangeRequest(
          { flow }
        )
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
  await userAccountRoutes.bind({
    event: 'Email.Verify_Email.Result',
    api: 'UserAccount.Change_Main_Email.Email_Confirm_Result',
    route: 'Change-Account-Email',
  })
})
