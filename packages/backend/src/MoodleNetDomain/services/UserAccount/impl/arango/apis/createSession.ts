import { call } from '../../../../../../lib/domain/amqp/call'
import { WrkTypes } from '../../../../../../lib/domain/wrk'
import { createSessionByActiveUserAccount } from '../../../helpers'
import { MutationResolvers } from '../../../UserAccount.graphql.gen'
import { getVerifiedAccountByUsernameAndPassword } from '../functions/getVerifiedAccountByUsernameAndPassword'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'
import { Persistence } from '../types'

export type T = WrkTypes<MoodleNetArangoUserAccountSubDomain, 'UserAccount.Session.Create'>
export const SessionCreateWorker = ({ persistence }: { persistence: Persistence }) => {
  const worker: T['Worker'] = async ({ username, password, ctx }) => {
    const account = await getVerifiedAccountByUsernameAndPassword({ persistence, username, password })
    if (!account) {
      return { jwt: null }
    }

    const session = await createSessionByActiveUserAccount({
      activeUserAccount: account,
      ctx,
    })

    return session
  }
  return worker
}

export const createSession: MutationResolvers['createSession'] = async (_parent, { password, username }, ctx) => {
  const session = await call<MoodleNetArangoUserAccountSubDomain>()('UserAccount.Session.Create', ctx.flow)({
    password,
    username,
    ctx,
  })
  return {
    __typename: 'CreateSession',
    jwt: session.jwt,
    message: null,
  }
}
