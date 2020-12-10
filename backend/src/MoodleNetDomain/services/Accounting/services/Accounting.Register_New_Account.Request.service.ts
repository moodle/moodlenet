import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../accounting.env'
import { fillEmailTemplate } from '../accounting.helpers'
import { accountingRoutes } from '../Accounting.routes'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'Accounting.Register_New_Account.Request',
    async handler({ flow, req }) {
      const config = await accountPersistence.config()
      const {
        newAccountRequestEmail,
        sendEmailConfirmationAttempts,
        sendEmailConfirmationDelaySecs,
      } = config
      const resp = await accountPersistence.addNewAccountRequest({ req, flow })
      if (resp === true) {
        const email = fillEmailTemplate({
          template: newAccountRequestEmail,
          to: req.email,
          vars: { email: req.email, link: `https://xxx.xxx/new-account-confirm/{{=it.token}}` },
        })
        await MoodleNet.callApi({
          api: 'Email.Verify_Email.Req',
          flow: accountingRoutes.reflow(flow, 'Register_New_Account'),
          req: {
            timeoutSecs: sendEmailConfirmationDelaySecs,
            email,
            maxAttempts: sendEmailConfirmationAttempts,
          },
          opts: { justEnqueue: true },
        })
        return { success: true } as const
      } else {
        return { success: false, reason: resp } //as const
      }
    },
  })
})
