import { MutationResolvers } from '../UserAccount.graphql.gen'
import {
  graphQLRequestApiCaller,
  loggedUserOnly,
} from '../../../MoodleNetGraphQL'
import { v4 as uuidV4 } from 'uuid'
import { MoodleNet } from '../../..'
import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { Flow } from '../../../../lib/domain/types/path'
import {
  Messages,
  UserAccountRecord,
  UserAccountStatus,
} from '../persistence/types'
import { getAccountPersistence } from '../UserAccount.env'
import { fillEmailTemplate } from '../UserAccount.helpers'
import { userAccountRoutes } from '../UserAccount.routes'

export type ChangeAccountEmailRequestPersistence = (_: {
  flow: Flow
  token: string
  accountId: string
  newEmail: string
}) => Promise<
  UserAccountRecord | Messages.EmailNotAvailable | Messages.NotFound
>

export type ChangeAccountEmailRequest = { accountId: string; newEmail: string }
export type ChangeAccountEmailRequestApi = Api<
  ChangeAccountEmailRequest,
  { success: true } | { success: false; reason: string }
>

export const ChangeAccountEmailRequestApiHandler = async () => {
  const { changeAccountEmailRequest, getConfig } = await getAccountPersistence()
  const handler: RespondApiHandler<ChangeAccountEmailRequestApi> = async ({
    flow,
    req: { accountId, newEmail },
  }) => {
    const token = uuidV4()
    const mAccountOrError = await changeAccountEmailRequest({
      accountId,
      flow,
      newEmail,
      token,
    })

    if (
      typeof mAccountOrError === 'object' &&
      mAccountOrError.status === UserAccountStatus.Active
    ) {
      const { username } = mAccountOrError
      const {
        changeAccountEmailRequestEmail,
        changeAccountEmailVerificationWaitSecs,
      } = await getConfig()
      const emailObj = fillEmailTemplate({
        template: changeAccountEmailRequestEmail,
        to: newEmail,
        vars: {
          username,
          link: `https://xxx.xxx/change-account-email/${token}`,
        },
      })

      await Promise.all([
        MoodleNet.callApi({
          api: 'Email.SendOne.SendNow',
          flow: userAccountRoutes.setRoute(flow, 'Change-Account-Email'),
          req: { emailObj },
          opts: { justEnqueue: true },
        }),
        MoodleNet.callApi({
          api: 'UserAccount.ChangeMainEmail.DeleteRequest',
          flow,
          req: { token },
          opts: {
            justEnqueue: true,
            delaySecs: changeAccountEmailVerificationWaitSecs,
          },
        }),
      ])

      return { success: true } as const
    } else {
      const reason =
        typeof mAccountOrError === 'string' ? mAccountOrError : 'not found'
      return { success: false, reason }
    }
  }

  return handler
}

export const changeEmailRequest: MutationResolvers['changeEmailRequest'] = async (
  _parent,
  { newEmail },
  context
) => {
  const { accountId } = loggedUserOnly({ context })

  const { res } = await graphQLRequestApiCaller({
    api: 'UserAccount.ChangeMainEmail.Request',
    req: { newEmail, accountId },
  })

  if (res.___ERROR) {
    return {
      __typename: 'SimpleResponse',
      message: res.___ERROR.msg,
      success: false,
    }
  } else if (!res.success) {
    return {
      __typename: 'SimpleResponse',
      message: res.reason,
      success: false,
    }
  } else {
    return {
      __typename: 'SimpleResponse',
      success: true,
      message: null,
    }
  }
}
