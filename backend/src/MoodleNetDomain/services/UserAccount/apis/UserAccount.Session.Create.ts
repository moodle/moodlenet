import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { graphQLRequestApiCaller } from '../../../MoodleNetGraphQL'
import { UserAccountStatus } from '../persistence/types'
import { MaybeSessionAuth } from '../UserAccount'
import {
  Auth,
  MutationResolvers,
  SessionAccount,
} from '../UserAccount.graphql.gen'
import { getVerifiedAccountByUsername, signJwt } from '../UserAccount.helpers'

export type Session_Create_Api = Api<
  { username: string; password: string },
  MaybeSessionAuth
>

export const Session_Create_Api_Handler = async () => {
  const handler: RespondApiHandler<Session_Create_Api> = async ({
    /* flow, */ req: { username, password },
  }) => {
    const account = await getVerifiedAccountByUsername({
      username,
      password,
    })

    if (!account) {
      return { auth: null }
    }

    const jwt = await signJwt({ account })

    return { auth: { userAccount: account, jwt } }
  }

  return handler
}

export const createSession: MutationResolvers['createSession'] = async (
  _parent,
  { password, username }
) => {
  const { res } = await graphQLRequestApiCaller({
    api: 'UserAccount.Session.Create',
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
