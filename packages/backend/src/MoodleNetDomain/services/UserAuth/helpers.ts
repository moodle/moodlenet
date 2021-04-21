import Argon from 'argon2'
import { getJwtSigner } from '../../executionContext'
import { ArgonPwdHashOpts } from './argon'
import { ActiveUser } from './impl/arango/types'
import { SimpleResponse, UserSession } from './UserAuth.graphql.gen'

export const userSessionByActiveUser = async ({ activeUser }: { activeUser: ActiveUser }) => {
  const session: UserSession = {
    __typename: 'UserSession',
    userId: activeUser._id,
    changeEmailRequest: activeUser.changeEmailRequest?.email ?? null,
    email: activeUser.email,
    username: activeUser.username,
    profileId: activeUser.profileId,
  }
  return session
}

export const createSessionByActiveUser = async ({
  activeUser,
}: {
  activeUser: ActiveUser
}): Promise<{ jwt: string }> => {
  const jwt = await await jwtByActiveUser({
    activeUser: activeUser,
  })
  return {
    jwt,
  }
}

export const jwtByActiveUser = async ({ activeUser }: { activeUser: ActiveUser }) => {
  const signJwt = getJwtSigner()
  const jwt = await signJwt({
    user: activeUser,
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
