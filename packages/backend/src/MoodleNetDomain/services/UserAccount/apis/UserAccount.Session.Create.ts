import { api } from '../../../../lib/domain'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { MoodleNetExecutionContext } from '../../../types'
import { MutationResolvers } from '../UserAccount.graphql.gen'
import { createSessionByActiveUserAccount, getVerifiedAccountByUsernameAndPassword } from '../UserAccount.helpers'

export type SessionCreateReq = { username: string; password: string; ctx: MoodleNetExecutionContext }
export type SessionCreateRes = { jwt: string | null }

export async function SessionCreateApiHandler({
  username,
  password,
  ctx,
}: SessionCreateReq): Promise<SessionCreateRes> {
  const account = await getVerifiedAccountByUsernameAndPassword({
    username,
    password,
  })

  if (!account) {
    return { jwt: null }
  }

  const session = await createSessionByActiveUserAccount({
    activeUserAccount: account,
    ctx,
  })

  return session
}

export const createSession: MutationResolvers['createSession'] = async (_parent, { password, username }, ctx) => {
  const session = await api<MoodleNetDomain>(ctx.flow)('UserAccount.Session.Create').call(createSession =>
    createSession({ password, username, ctx }),
  )
  return {
    __typename: 'CreateSession',
    jwt: session.jwt,
    message: null,
  }
}
