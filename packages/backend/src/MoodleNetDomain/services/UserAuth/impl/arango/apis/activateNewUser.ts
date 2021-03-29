import { makeId } from '@moodlenet/common/lib/utils/content-graph'
import { call } from '../../../../../../lib/domain/amqp/call'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { ulidKey } from '../../../../../../lib/helpers/arango'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'
import { hashPassword, jwtByActiveUser } from '../../../helpers'
import { MutationResolvers } from '../../../UserAuth.graphql.gen'
import { activateNewUser } from '../functions/activateNewUser'
import { MoodleNetArangoUserAuthSubDomain } from '../MoodleNetArangoUserAuthSubDomain'
import { Persistence } from '../types'

export const ConfirmEmailActivateUserWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoUserAuthSubDomain, 'UserAuth.RegisterNewUser.ConfirmEmailActivateUser'> => async ({
  flow,
  token,
  password,
  username,
}) => {
  const hashedPassword = await hashPassword({ pwd: password })
  const userKey = ulidKey()
  const profileId = makeId('Profile', userKey)
  const activationResult = await activateNewUser({
    persistence,
    token,
    username,
    password: hashedPassword,
    profileId,
  })
  if (typeof activationResult !== 'string') {
    await call<MoodleNetDomain>()('ContentGraph.CreateProfileForNewUser', flow)({ username, key: userKey })

    return activationResult
  } else {
    return activationResult
  }
}

export const activateUser: MutationResolvers['activateUser'] = async (
  _parent,
  { password, username, token },
  context,
) => {
  const activeUserOrErrString = await call<MoodleNetArangoUserAuthSubDomain>()(
    'UserAuth.RegisterNewUser.ConfirmEmailActivateUser',
    context.flow,
  )({ password, token, username, flow: context.flow })

  if (typeof activeUserOrErrString === 'string') {
    return {
      __typename: 'CreateSession',
      jwt: null,
      message: activeUserOrErrString,
    }
  } else {
    const activeUser = activeUserOrErrString
    const jwt = await jwtByActiveUser({ activeUser })

    return {
      __typename: 'CreateSession',
      jwt,
      message: null,
    }
  }
}
