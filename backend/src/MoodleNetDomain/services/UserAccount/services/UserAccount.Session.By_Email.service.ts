import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../UserAccount.env'
import { fillEmailTemplate, signJwt } from '../UserAccount.helpers'
import { userAccountRoutes } from '../UserAccount.routes'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'UserAccount.Session.By_Email',
    async handler({ flow, req: { email, username } }) {
      const config = await accountPersistence.getConfig()
      const { tempSessionEmail: resetAccountPasswordRequestEmail } = config
      const account = await accountPersistence.getActiveAccountByUsername({
        username,
      })
      if (!account || account.email !== email) {
        return { success: false, reason: 'not found' }
      }
      const jwt = signJwt({ account })
      const emailObj = fillEmailTemplate({
        template: resetAccountPasswordRequestEmail,
        to: account.email,
        vars: { username, link: `https://xxx.xxx/temp-session/${jwt}` },
      })
      await MoodleNet.callApi({
        api: 'Email.Send_One.Send_Now',
        flow: userAccountRoutes.setRoute(flow, 'Temp-Email-Session'),
        req: {
          emailObj,
        },
        opts: { justEnqueue: true },
      })
      return { success: true } as const
    },
  })
})
