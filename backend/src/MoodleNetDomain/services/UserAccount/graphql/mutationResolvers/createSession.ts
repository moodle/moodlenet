import { MoodleNet } from '../../../..'
import { userAccountRoutes } from '../../UserAccount.routes'
import {
  MutationResolvers,
  SessionAccount,
  Auth,
} from '../../UserAccount.graphql.gen'
import { UserAccountStatus } from '../../persistence/types'

export const createSession: MutationResolvers['createSession'] = async (
  _parent,
  { password, username }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'UserAccount.Session.Create',
    flow: userAccountRoutes.flow('UserAccount-GraphQL-Request'),
    req: { password, username },
  })
  if (res.___ERROR || !res.auth) {
    return {
      __typename: 'Session',
      message: res.___ERROR?.msg || 'not found',
      auth: null,
    } as const
  } else if (res.auth.userAccount.status !== UserAccountStatus.Active) {
    return {
      __typename: 'Session',
      message: 'not active',
      auth: null,
    } as const
  } else {
    const {
      jwt,
      userAccount: { email, _id, changeEmailRequest },
    } = res.auth

    const sessionAccount: SessionAccount = {
      __typename: 'SessionAccount',
      accountId: _id,
      email,
      username,
      changeEmailRequest: changeEmailRequest?.email ?? null,
    }

    const auth: Auth = {
      __typename: 'Auth',
      jwt,
      sessionAccount,
    }

    return {
      __typename: 'Session',
      message: null,
      auth,
    } as const
  }
}
