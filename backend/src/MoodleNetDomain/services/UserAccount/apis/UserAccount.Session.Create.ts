import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { graphQLRequestApiCaller } from '../../../MoodleNetGraphQL'
import { UserAccountStatus } from '../persistence/types'
import { SessionAuth } from '../UserAccount'
import {
  Auth,
  MutationResolvers,
  SessionAccount,
} from '../UserAccount.graphql.gen'
import { getVerifiedAccountByUsername } from '../UserAccount.helpers'

export type SessionCreateApi = Api<
  { username: string; password: string },
  SessionAuth
>

export const SessionCreateApiHandler = async () => {
  const handler: RespondApiHandler<SessionCreateApi> = async ({
    /* flow, */ req: { username, password },
  }) => {
    const account = await getVerifiedAccountByUsername({
      username,
      password,
    })

    if (!account) {
      return { userAccount: null }
    }

    return { userAccount: account }
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
  if (res.___ERROR || !res.userAccount) {
    return {
      __typename: 'Session',
      message: res.___ERROR?.msg || 'not found',
      auth: null,
    } as const
  } else if (res.userAccount.status !== UserAccountStatus.Active) {
    return {
      __typename: 'Session',
      message: 'not active',
      auth: null,
    } as const
  } else {
    const {
      userAccount: { email, _id, changeEmailRequest },
    } = res

    const sessionAccount: SessionAccount = {
      __typename: 'SessionAccount',
      accountId: _id,
      email,
      username,
      changeEmailRequest: changeEmailRequest?.email ?? null,
    }

    const auth: Auth = {
      __typename: 'Auth',
      sessionAccount,
    }

    return {
      __typename: 'Session',
      message: null,
      auth,
    } as const
  }
}
