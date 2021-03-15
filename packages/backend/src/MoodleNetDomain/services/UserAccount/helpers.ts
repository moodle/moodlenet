import Argon from 'argon2'
import { call } from '../../../lib/domain/amqp/call'
import { MoodleNetDomain } from '../../MoodleNetDomain'
import { getJwtSigner, MoodleNetExecutionContext } from '../../MoodleNetGraphQL'
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
  // console.log(
  //   `*************\n*************\n*************\n*************\n*************\n userAndJwtByActiveUserAccount`,
  //   {
  //     ...activeUserAccount,
  //     ___id: activeUserAccount.userId,
  //   },
  // )
  const user = await call<MoodleNetDomain>()('ContentGraph.GetAccountUser', ctx.flow)({
    userId: activeUserAccount.userId,
  })
  // console.log(
  //   `*************\n*************\n*************\n*************\n*************\n userAndJwtByActiveUserAccount->ContentGraph.Node.ById`,
  //   user,
  // )
  if (!user) {
    throw new Error(`can't find User for Account  userId:${activeUserAccount.userId} `)
  }
  const jwt = await jwtByActiveUserAccount({
    activeUserAccount,
  })
  return { jwt, user: user }
}

export const jwtByActiveUserAccount = async ({ activeUserAccount }: { activeUserAccount: ActiveUserAccount }) => {
  const signJwt = getJwtSigner()
  const jwt = await signJwt({
    account: activeUserAccount,
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
