import { call } from '../../../../../../lib/domain/amqp/call'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { createSessionByActiveUserAccount } from '../../../helpers'
import { MutationResolvers } from '../../../UserAccount.graphql.gen'
import { getVerifiedAccountByUsernameAndPassword } from '../functions/getVerifiedAccountByUsernameAndPassword'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'
import { Persistence } from '../types'

export const SessionCreateWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoUserAccountSubDomain, 'UserAccount.Session.Create'> => async ({
  username,
  password,
}) => {
  const account = await getVerifiedAccountByUsernameAndPassword({ persistence, username, password })
  if (!account) {
    return { jwt: null }
  }

  const session = await createSessionByActiveUserAccount({ activeUserAccount: account })

  return session
}

export const createSession: MutationResolvers['createSession'] = async (_parent, { password, username }, ctx) => {
  const session = await call<MoodleNetArangoUserAccountSubDomain>()('UserAccount.Session.Create', ctx.flow)({
    password,
    username,
  })
  return {
    __typename: 'CreateSession',
    jwt: session.jwt,
    message: null,
  }
}
