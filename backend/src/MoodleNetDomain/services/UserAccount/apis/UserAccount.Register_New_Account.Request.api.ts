import { v4 as uuidV4 } from 'uuid'
import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../UserAccount.env'
import { fillEmailTemplate } from '../UserAccount.helpers'
import { userAccountRoutes } from '../UserAccount.routes'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'UserAccount.Register_New_Account.Request',
    async handler({ flow, req: { email } }) {
      const config = await accountPersistence.getConfig()
      const { newAccountRequestEmail } = config
      const token = uuidV4()

      const respError = await accountPersistence.newAccountRequest({
        email,
        flow,
        token,
      })
      if (respError) {
        return { success: false, reason: respError } as const
      } else {
        const emailObj = fillEmailTemplate({
          template: newAccountRequestEmail,
          to: email,
          vars: {
            email,
            link: `https://xxx.xxx/new-account-confirm/${token}`,
          },
        })
        await MoodleNet.callApi({
          api: 'Email.Send_One.Send_Now',
          flow: userAccountRoutes.setRoute(flow, 'Register-New-Account'),
          req: { emailObj },
          opts: { justEnqueue: true },
        })
        return { success: true } as const
      }
    },
  })
})
