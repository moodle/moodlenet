import { MoodleNet } from '../../..'
import { MutationResolvers, UserSession } from '../UserAccount.graphql.gen'
import {
  getVerifiedAccountByUsernameAndPassword,
  userSessionByActiveUserAccount,
} from '../UserAccount.helpers'

export type SessionCreateReq = { username: string; password: string }
export type SessionCreateRes = { session: UserSession | null }

export async function SessionCreateApiHandler({
  username,
  password,
}: SessionCreateReq): Promise<SessionCreateRes> {
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

export const createSession: MutationResolvers['createSession'] = async (
  _parent,
  { password, username },
  context
) => {
  const res = await MoodleNet.api('UserAccount.Session.Create').call(
    (createSession) => createSession({ password, username }),
    context.flow
  )
  return res.session
}
