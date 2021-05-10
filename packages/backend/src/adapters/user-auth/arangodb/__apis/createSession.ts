import { call } from '../../../../../../lib/domain/amqp/call'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { createSessionByActiveUser } from '../../../helpers'
import { MutationResolvers } from '../../../UserAuth.graphql.gen'
import { getVerifiedUserByUsernameAndPassword } from '../functions/getVerifiedUserByUsernameAndPassword'
import { MoodleNetArangoUserAuthSubDomain } from '../MoodleNetArangoUserAuthSubDomain'
import { Persistence } from '../types'

export const SessionCreateWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoUserAuthSubDomain, 'UserAuth.Session.Create'> => async ({ username, password }) => {
  const user = await getVerifiedUserByUsernameAndPassword({ persistence, username, password })
  if (!user) {
    return { jwt: null }
  }

  const session = await createSessionByActiveUser({ activeUser: user })

  return session
}

export const createSession: MutationResolvers['createSession'] = async (_parent, { password, username }, ctx) => {
  const session = await call<MoodleNetArangoUserAuthSubDomain>()('UserAuth.Session.Create', ctx.flow)({
    password,
    username,
  })
  return {
    __typename: 'CreateSession',
    jwt: session.jwt,
    message: null,
  }
}
