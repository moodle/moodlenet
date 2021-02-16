import { api } from '../../../../lib/domain'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { MutationResolvers } from '../UserAccount.graphql.gen'
import { createSessionByActiveUserAccount, getVerifiedAccountByUsernameAndPassword } from '../UserAccount.helpers'

export type SessionCreateReq = { username: string; password: string }
export type SessionCreateRes = { jwt: string | null }

export async function SessionCreateApiHandler({ username, password }: SessionCreateReq): Promise<SessionCreateRes> {
  const account = await getVerifiedAccountByUsernameAndPassword({
    username,
    password,
  })

  if (!account) {
    return { jwt: null }
  }

  const session = await createSessionByActiveUserAccount({
    activeUserAccount: account,
  })

  return session
}

export const createSession: MutationResolvers['createSession'] = async (_parent, { password, username }, context) => {
  const session = await api<MoodleNetDomain>(context.flow)('UserAccount.Session.Create').call(createSession =>
    createSession({ password, username }),
  )
  return {
    __typename: 'CreateSession',
    jwt: session.jwt,
    message: null,
  }
}
