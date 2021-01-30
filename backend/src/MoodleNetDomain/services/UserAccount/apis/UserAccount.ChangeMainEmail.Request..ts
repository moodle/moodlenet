import { v4 as uuidV4 } from 'uuid'
import { MoodleNet } from '../../..'
import { Flow } from '../../../../lib/domain/types/path'
import { loggedUserOnly } from '../../../MoodleNetGraphQL'
import {
  Messages,
  UserAccountRecord,
  UserAccountStatus,
} from '../persistence/types'
import { getAccountPersistence } from '../UserAccount.env'
import { MutationResolvers } from '../UserAccount.graphql.gen'
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

export type ChangeAccountEmailRequestReq = {
  accountId: string
  newEmail: string
  flow: Flow
}
export type ChangeAccountEmailRequestRes =
  | { success: true }
  | { success: false; reason: string }

export const ChangeAccountEmailRequestHandler = async ({
  flow,
  accountId,
  newEmail,
}: ChangeAccountEmailRequestReq): Promise<ChangeAccountEmailRequestRes> => {
  const { changeAccountEmailRequest, getConfig } = await getAccountPersistence()
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
      MoodleNet.api('Email.SendOne.SendNow').enqueue(
        (sendOne, flow) => sendOne({ emailObj, flow }),
        userAccountRoutes.setRoute(flow, 'Change-Account-Email')
      ),
      MoodleNet.api('UserAccount.ChangeMainEmail.DeleteRequest').enqueue(
        (deleteRequest) => deleteRequest({ token }),
        flow,
        {
          delaySecs: changeAccountEmailVerificationWaitSecs,
        }
      ),
    ])

    return { success: true }
  } else {
    const reason =
      typeof mAccountOrError === 'string' ? mAccountOrError : 'not found'
    return { success: false, reason }
  }
}

export const changeEmailRequest: MutationResolvers['changeEmailRequest'] = async (
  _parent,
  { newEmail },
  context
) => {
  const { accountId } = loggedUserOnly({ context })

  const res = await MoodleNet.api(
    'UserAccount.ChangeMainEmail.Request'
  ).call((changeMainEmailReq) =>
    changeMainEmailReq({ newEmail, accountId, flow: context.flow })
  )

  if (!res.success) {
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
