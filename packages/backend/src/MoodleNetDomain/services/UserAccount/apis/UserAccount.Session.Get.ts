import { UserSession, QueryResolvers } from './../UserAccount.graphql.gen'
import { api } from '../../../../lib/domain'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { userSessionByActiveUserAccount } from '../UserAccount.helpers'
import { getAccountPersistence } from './../UserAccount.env'

export type SessionGetReq = { username: string }
export type SessionGetRes = UserSession | null

export async function SessionGetApiHandler({ username }: SessionGetReq): Promise<SessionGetRes> {
  const accountPersistence = await getAccountPersistence()
  const account = await accountPersistence.getActiveAccountByUsername({
    username,
  })

  if (!account) {
    return null
  }

  const session = await userSessionByActiveUserAccount({
    activeUserAccount: account,
  })

  return session
}

export const getSession: QueryResolvers['getSession'] = async (_parent, {}, context) => {
  const username = context.auth?.username
  if (!username) {
    return null
  }

  const maybeSession = await api<MoodleNetDomain>(context.flow)('UserAccount.Session.Get').call(sessionGet =>
    sessionGet({ username }),
  )
  return maybeSession
}
