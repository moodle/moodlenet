import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../accounting.env'
import { fillEmailTemplate, signJwt } from '../accounting.helpers'
import { accountingRoutes } from '../Accounting.routes'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'Accounting.Temp_Email_Session',
    async handler({ flow, req: { email, username } }) {
      const config = await accountPersistence.config()
      const { tempSessionEmail: resetAccountPasswordRequestEmail } = config
      const account = await accountPersistence.getAccountByUsername({ username })
      if (!account || account.email !== email) {
        return { success: false, reason: 'not found' }
      }
      const resetPwdJwt = signJwt({
        payload: { username },
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
        flow: accountingRoutes.reflow(flow, 'Temp_Email_Session'),
        req: {
          emailObj,
        },
        opts: { justEnqueue: true },
      })
      return { success: true } as const
    },
  })
})
