import { makeId, NodeType } from '@moodlenet/common/lib/utils/content-graph'
import Argon from 'argon2'
import { call } from '../../../lib/domain/amqp/call'
import { MoodleNetDomain } from '../../MoodleNetDomain'
import { getJwtSigner, MoodleNetExecutionContext } from '../../MoodleNetGraphQL'
import { User } from '../ContentGraph/ContentGraph.graphql.gen'
import { ShallowNode } from '../ContentGraph/types.node'
import { ArgonPwdHashOpts } from './argon'
import { ActiveUserAccount } from './impl/arango/types'
import { SimpleResponse, UserSession } from './UserAccount.graphql.gen'

export const userSessionByActiveUserAccount = async ({
  activeUserAccount,
}: {
  activeUserAccount: ActiveUserAccount
}) => {
  const session: UserSession = {
    __typename: 'UserSession',
    accountId: activeUserAccount._id,
    changeEmailRequest: activeUserAccount.changeEmailRequest?.email ?? null,
    email: activeUserAccount.email,
    username: activeUserAccount.username,
    userId: activeUserAccount.userId,
  }
  return session
}

export const createSessionByActiveUserAccount = async ({
  activeUserAccount,
  ctx,
}: {
  ctx: MoodleNetExecutionContext
  activeUserAccount: ActiveUserAccount
}): Promise<{ jwt: string | null }> => {
  const { jwt } = await userAndJwtByActiveUserAccount({ activeUserAccount, ctx })
  return {
    jwt,
  }
}

export const userAndJwtByActiveUserAccount = async ({
  activeUserAccount,
  ctx,
}: {
  activeUserAccount: ActiveUserAccount
  ctx: MoodleNetExecutionContext
}) => {
  console.log(`*************\n*************\n*************\n*************\n*************\nContentGraph.Node.ById`, {
    ...activeUserAccount,
    ___id: makeId(NodeType.User, activeUserAccount.userId),
  })
  const user = await call<MoodleNetDomain>()('ContentGraph.Node.ById', ctx.flow)<User>({
    _id: activeUserAccount.userId,
    ctx,
  })
  if (!user) {
    throw new Error(`can't find User for Account Username: ${activeUserAccount.username}`)
  }
  const jwt = await jwtByActiveUserAccountAndUser({
    activeUserAccount,
    user,
  })
  return { jwt, user: user }
}

export const jwtByActiveUserAccountAndUser = async ({
  activeUserAccount,
  user,
}: {
  activeUserAccount: ActiveUserAccount
  user: ShallowNode<User>
}) => {
  const signJwt = getJwtSigner()
  const jwt = await signJwt({
    account: activeUserAccount,
    user,
  })
  return jwt
}

export const getSimpleResponse = ({
  success,
  message,
}:
  | {
      success?: false
      message: string | null | undefined
    }
  | {
      success: true
      message?: null
    }): SimpleResponse => ({
  __typename: 'SimpleResponse',
  success: !!success,
  message: message || null,
})

export const hashPassword = (_: { pwd: string }) => {
  const { pwd } = _
  const hashedPassword = Argon.hash(pwd, ArgonPwdHashOpts)
  return hashedPassword
}

export const verifyPassword = (_: { hash: string; pwd: string | Buffer }) => {
  const { pwd, hash } = _
  return Argon.verify(hash, pwd, ArgonPwdHashOpts)
}
