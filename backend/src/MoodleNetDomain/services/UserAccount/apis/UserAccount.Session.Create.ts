import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { graphQLRequestApiCaller } from '../../../MoodleNetGraphQL'
import { MutationResolvers, UserSession } from '../UserAccount.graphql.gen'
import {
  userSessionByActiveUserAccount,
  getVerifiedAccountByUsernameAndPassword,
} from '../UserAccount.helpers'

export type SessionCreateApi = Api<
  { username: string; password: string },
  { session: UserSession | null }
>

export const SessionCreateApiHandler = async () => {
  const handler: RespondApiHandler<SessionCreateApi> = async ({
    /* flow, */ req: { username, password },
  }) => {
    const account = await getVerifiedAccountByUsernameAndPassword({
      username,
      password,
    })

    if (!account) {
      return { session: null }
    }

    const session = await userSessionByActiveUserAccount({
      activeUserAccount: account,
    })

    return { session }
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
  if (res.___ERROR || !res.session) {
    return null
  } else {
    return res.session
  }
}
