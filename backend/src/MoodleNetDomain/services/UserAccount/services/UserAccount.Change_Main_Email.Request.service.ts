import { v4 as uuidV4 } from 'uuid'
import { MoodleNet } from '../../..'
import { UserAccountStatus } from '../persistence/types'
import { getAccountPersistence } from '../UserAccount.env'
import { fillEmailTemplate } from '../UserAccount.helpers'
import { userAccountRoutes } from '../UserAccount.routes'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'UserAccount.Change_Main_Email.Request',
    async handler({ flow, req: { accountId, newEmail } }) {
      const token = uuidV4()
      const mAccountOrError = await accountPersistence.changeAccountEmailRequest(
        {
          accountId,
          flow,
          newEmail,
          token,
        }
      )

      if (
        typeof mAccountOrError === 'object' &&
        mAccountOrError.status === UserAccountStatus.Active
      ) {
        const { username } = mAccountOrError
        const {
          changeAccountEmailRequestEmail,
        } = await accountPersistence.getConfig()
        const emailObj = fillEmailTemplate({
          template: changeAccountEmailRequestEmail,
          to: newEmail,
          vars: {
            username,
            link: `https://xxx.xxx/change-account-email/${token}`,
          },
        })

        const { res } = await MoodleNet.callApi({
          api: 'Email.Send_One.Send_Now',
          flow: userAccountRoutes.setRoute(flow, 'Change-Account-Email'),
          req: { emailObj },
          opts: { justEnqueue: true },
        })
        if (res.___ERROR) {
          return { success: false, reason: res.___ERROR.msg } as const
        }

        return { success: true } as const
      } else {
        const reason =
          typeof mAccountOrError === 'string' ? mAccountOrError : 'not found'
        return { success: false, reason }
      }
    },
  })
})
