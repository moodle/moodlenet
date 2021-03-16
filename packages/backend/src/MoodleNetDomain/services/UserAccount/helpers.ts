import Argon from 'argon2'
import { getJwtSigner } from '../../MoodleNetGraphQL'
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
}: {
  activeUserAccount: ActiveUserAccount
}): Promise<{ jwt: string }> => {
  const jwt = await await jwtByActiveUserAccount({
    activeUserAccount,
  })
  return {
    jwt,
  }
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
