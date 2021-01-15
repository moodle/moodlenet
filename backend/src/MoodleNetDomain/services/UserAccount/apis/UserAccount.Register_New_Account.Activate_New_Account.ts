import { MoodleNet } from '../../..'
import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { Event } from '../../../../lib/domain/event/types'
import { graphQLRequestApiCaller } from '../../../MoodleNetGraphQL'
import { ActiveUserAccount, Messages } from '../persistence/types'
import { MaybeSessionAuth } from '../UserAccount'
import { getAccountPersistence } from '../UserAccount.env'
import { MutationResolvers } from '../UserAccount.graphql.gen'
import { hashPassword, signJwt } from '../UserAccount.helpers'

export type NewAccountActivatedEvent = Event<{
  accountId: string
  username: string
}>

export type ActivateNewAccountPersistence = (_: {
  token: string
  username: string
  password: string
}) => Promise<
  ActiveUserAccount | Messages.NotFound | Messages.UsernameNotAvailable
>

export type Confirm_Email_Activate_Account_Api = Api<
  { token: string; password: string; username: string },
  MaybeSessionAuth
>

export const Confirm_Email_Activate_Account_Api_Handler = async () => {
  const { activateNewAccount } = await getAccountPersistence()
  const handler: RespondApiHandler<Confirm_Email_Activate_Account_Api> = async ({
    flow,
    req: { token, password, username },
  }) => {
    const hashedPassword = await hashPassword({ pwd: password })
    const maybeAccount = await activateNewAccount({
      token,
      username,
      password: hashedPassword,
    })
    if (typeof maybeAccount === 'string') {
      return { auth: null }
    } else {
      const { username, _id } = maybeAccount
      const jwt = await signJwt({ account: maybeAccount })
      MoodleNet.emitEvent({
        event: 'UserAccount.Register_New_Account.New_Account_Activated',
        flow,
        payload: { accountId: _id, username },
      })

      return { auth: { jwt, userAccount: maybeAccount } }
    }
  }
  return handler
}

export const activateAccount: MutationResolvers['activateAccount'] = async (
  _parent,
  { password, username, token }
) => {
  const { res } = await graphQLRequestApiCaller({
    api: 'UserAccount.Register_New_Account.Confirm_Email_Activate_Account',
    req: { password, token, username },
  })
  if (res.___ERROR) {
    return {
      __typename: 'Session',
      message: res.___ERROR.msg,
      auth: null,
    }
  } else if (!res.auth) {
    return {
      __typename: 'Session',
      auth: null,
      message: 'not found',
    }
  } else {
    const {
      jwt,
      userAccount: { changeEmailRequest, username, email, _id },
    } = res.auth
    return {
      __typename: 'Session',
      auth: {
        __typename: 'Auth',
        jwt,
        sessionAccount: {
          __typename: 'SessionAccount',
          accountId: _id,
          changeEmailRequest: changeEmailRequest?.email || null,
          email,
          username,
        },
      },
      message: null,
    }
  }
}
