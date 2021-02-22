import { Id, makeId } from '@moodlenet/common/lib/utils/content-graph'
import { api, event } from '../../../../lib/domain'
import { Event } from '../../../../lib/domain/event/types'
import { Flow } from '../../../../lib/domain/types/path'
import { ulidKey } from '../../../../lib/helpers/arango'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { getSystemExecutionContextFor } from '../../../types'
import { NodeType, User } from '../../ContentGraph/ContentGraph.graphql.gen'
import { ActiveUserAccount, Messages } from '../persistence/types'
import { getAccountPersistence } from '../UserAccount.env'
import { MutationResolvers } from '../UserAccount.graphql.gen'
import { hashPassword } from '../UserAccount.helpers'
import { ShallowNode } from './../../ContentGraph/persistence/types'
import { jwtByActiveUserAccountAndUser } from './../UserAccount.helpers'

export type NewAccountActivatedEvent = Event<{
  accountId: string
  username: string
}>

type ActivationMessage = Messages.NotFound | Messages.UsernameNotAvailable

export type ActivateNewAccountPersistence = (_: {
  token: string
  username: string
  password: string
  userId: Id
}) => Promise<ActiveUserAccount | ActivationMessage>

export type ConfirmEmailActivateAccountReq = {
  token: string
  password: string
  username: string
  flow: Flow
}
export type ConfirmEmailActivateAccountRes = ActivationMessage | { account: ActiveUserAccount; user: ShallowNode<User> }

export const ConfirmEmailActivateAccountApiHandler = async ({
  flow,
  token,
  password,
  username,
}: ConfirmEmailActivateAccountReq): Promise<ConfirmEmailActivateAccountRes> => {
  const { activateNewAccount } = await getAccountPersistence()
  const hashedPassword = await hashPassword({ pwd: password })
  const userKey = ulidKey()
  const activationResult = await activateNewAccount({
    token,
    username,
    password: hashedPassword,
    userId: makeId(NodeType.User, userKey),
  })
  if (typeof activationResult !== 'string') {
    const user = await api<MoodleNetDomain>(flow)('ContentGraph.Node.Create').call(createNode =>
      createNode<NodeType.User>({
        ctx: getSystemExecutionContextFor(),
        nodeType: NodeType.User,
        key: userKey,
        input: {
          name: activationResult.username,
          icon: '',
          summary: '',
        },
      }),
    )
    if (user.__typename === 'CreateNodeMutationError') {
      //TODO: manage this eventuality (rollback?)
      const errorMsg = `couldn't create user for username:${activationResult.username}, accountId: ${activationResult._id}`
      throw new Error(`${errorMsg} : ${user.type} ${user.details} `)
    }
    event<MoodleNetDomain>(flow)('UserAccount.RegisterNewAccount.NewAccountActivated').emit({
      payload: { accountId: activationResult._id, username: activationResult.username },
    })
    return { account: activationResult, user }
  } else {
    return activationResult
  }
}

export const activateAccount: MutationResolvers['activateAccount'] = async (
  _parent,
  { password, username, token },
  context,
) => {
  const res = await api<MoodleNetDomain>(context.flow)(
    'UserAccount.RegisterNewAccount.ConfirmEmailActivateAccount',
  ).call((confirmEmailActivateAccount, flow) => confirmEmailActivateAccount({ password, token, username, flow }))
  console.log('RESP -- UserAccount.RegisterNewAccount.ConfirmEmailActivateAccount ', res)
  if (typeof res === 'string') {
    return {
      __typename: 'CreateSession',
      jwt: null,
      message: res,
    }
  } else {
    const jwt = await jwtByActiveUserAccountAndUser({
      activeUserAccount: res.account,
      user: res.user,
    })

    return {
      __typename: 'CreateSession',
      jwt,
      message: null,
    }
  }
}
