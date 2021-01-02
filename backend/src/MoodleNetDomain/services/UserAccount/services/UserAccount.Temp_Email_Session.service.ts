import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../UserAccount.env'
import { fillEmailTemplate, signJwt } from '../UserAccount.helpers'
import { userAccountRoutes } from '../UserAccount.routes'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'UserAccount.Temp_Email_Session',
    async handler({ flow, req: { email, username } }) {
      const config = await accountPersistence.getConfig()
      const { tempSessionEmail: resetAccountPasswordRequestEmail } = config
      const account = await accountPersistence.getAccountByUsername({
        username,
      })
      if (!account || account.email !== email) {
        return { success: false, reason: 'not found' }
      }
      const resetPwdJwt = signJwt({
        //FIXME
        payload: {
          username,
          accountId: account.username,
          userId: account.username,
        },
        opts: {
          expiresIn: config.resetPasswordSessionValiditySecs,
        },
      })
      const emailObj = fillEmailTemplate({
        template: resetAccountPasswordRequestEmail,
        to: account.email,
        vars: { username, link: `https://xxx.xxx/temp-session/${resetPwdJwt}` },
      })
      await MoodleNet.callApi({
        api: 'Email.Send_One.Req',
        flow: userAccountRoutes.reflow(flow, 'Temp-Email-Session'),
        req: {
          emailObj,
        },
        opts: { justEnqueue: true },
      })
      return { success: true } as const
    },
  })
})
