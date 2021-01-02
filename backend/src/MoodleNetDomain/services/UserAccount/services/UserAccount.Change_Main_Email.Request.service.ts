import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../UserAccount.env'
import { fillEmailTemplate } from '../UserAccount.helpers'
import { userAccountRoutes } from '../UserAccount.routes'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'UserAccount.Change_Main_Email.Request',
    async handler({ flow, req }) {
      const config = await accountPersistence.getConfig()
      const {
        sendEmailConfirmationAttempts,
        sendEmailConfirmationDelaySecs,
        changeAccountEmailRequestEmail,
      } = config
      const resp = await accountPersistence.addChangeAccountEmailRequest({
        req,
        flow,
      })
      if (resp === true) {
        const email = fillEmailTemplate({
          template: changeAccountEmailRequestEmail,
          to: req.newEmail,
          vars: {
            username: req.username,
            link: `https://xxx.xxx/change-main-email/{{=it.token}}`,
          },
        })
        await MoodleNet.callApi({
          api: 'Email.Verify_Email.Req',
          flow: userAccountRoutes.reflow(flow, 'Change-Account-Email'),
          req: {
            timeoutSecs: sendEmailConfirmationDelaySecs,
            email,
            maxAttempts: sendEmailConfirmationAttempts,
          },
          opts: { justEnqueue: true },
        })
        return { success: true } as const
      } else {
        return { success: false, reason: resp }
      }
    },
  })
})
