import { call } from '../../../../../../lib/domain/amqp/call'
import { WrkTypes } from '../../../../../../lib/domain/wrk'
import { createSessionByActiveUserAccount } from '../../../helpers'
import { MutationResolvers } from '../../../UserAccount.graphql.gen'
import { DBReady, UserAccountDB } from '../env'
import { getVerifiedAccountByUsernameAndPassword } from '../functions/getVerifiedAccountByUsernameAndPassword'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'

export type T = WrkTypes<MoodleNetArangoUserAccountSubDomain, 'UserAccount.Session.Create'>
export const SessionCreateWorker = ({ db }: { db: UserAccountDB }) => {
  const worker: T['Worker'] = async ({ username, password, ctx }) => {
    const account = await getVerifiedAccountByUsernameAndPassword({ db, username, password })
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

export const SessionCreateWrkInit: T['Init'] = async () => {
  const db = await DBReady
  return [SessionCreateWorker({ db })]
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
