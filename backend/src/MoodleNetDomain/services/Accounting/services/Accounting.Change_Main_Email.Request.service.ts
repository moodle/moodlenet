import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../accounting.env'
import { accountingRoutes } from '../Accounting.routes'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'Accounting.Change_Main_Email.Request',
    async handler({ flow, req }) {
      const config = await accountPersistence.config()
      const {
        sendEmailConfirmationAttempts,
        sendEmailConfirmationDelay,
        changeAccountEmailRequestEmail,
      } = config
      const resp = await accountPersistence.addChangeAccountEmailRequest({ req, flow })
      if (resp === true) {
        await MoodleNet.callApi({
          api: 'Email.Verify_Email.Req',
          flow: accountingRoutes.reflow(flow, 'Change_Account_Email'),
          req: {
            timeoutMillis: sendEmailConfirmationDelay,
            email: {
              to: req.newEmail,
              from: changeAccountEmailRequestEmail.from,
              subject: changeAccountEmailRequestEmail.subject,
              text: changeAccountEmailRequestEmail.text,
            },
            maxAttempts: sendEmailConfirmationAttempts,
            tokenReplaceRegEx: '__TOKEN__',
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
