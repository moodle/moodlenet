import { makeId, NodeType } from '@moodlenet/common/lib/utils/content-graph'
import Argon from 'argon2'
import dot from 'dot'
import { api } from '../../../lib/domain'
import { MoodleNetDomain } from '../../MoodleNetDomain'
import { getJwtSigner, MoodleNetExecutionContext } from '../../MoodleNetGraphQL'
import { User } from '../ContentGraph/ContentGraph.graphql.gen'
import { EmailObj } from '../Email/types'
import { ShallowNode } from './../ContentGraph/persistence/types'
import { ActiveUserAccount, EmailTemplate } from './persistence/types'
import { ArgonPwdHashOpts, getAccountPersistence } from './UserAccount.env'
import { SimpleResponse, UserSession } from './UserAccount.graphql.gen'

export const userSessionByActiveUserAccount = async ({
  activeUserAccount,
}: {
  activeUserAccount: ActiveUserAccount
}): Promise<UserSession> => {
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
  const { node: user } = await api<MoodleNetDomain>()('ContentGraph.Node.ById').call(nodeById =>
    nodeById<User>({
      _id: makeId(NodeType.User, activeUserAccount.userId),
      ctx,
    }),
  )
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

export const fillEmailTemplate = <Vars>(_: {
  template: EmailTemplate<Vars>
  to: string
  vars: Vars
  type?: 'text' | 'html'
}): EmailObj => {
  const { template, to, vars, type = 'html' } = _
  const tplString = template[type]
  const msg = { [type]: tplString && dot.compile(tplString)(vars) }
  return {
    ...template,
    ...msg,
    to,
  }
}

export async function getVerifiedAccountByUsernameAndPassword({
  password,
  username,
}: {
  username: string
  password: string
}) {
  const accountPersistence = await getAccountPersistence()
  const account = await accountPersistence.getActiveAccountByUsername({
    username,
  })

  if (!account) {
    return null
  }
  const pwdVerified = await verifyPassword({
    hash: account.password,
    pwd: password,
  })

  return pwdVerified ? account : null
}
