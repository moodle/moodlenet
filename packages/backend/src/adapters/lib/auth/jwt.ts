import JWT from 'jsonwebtoken'
import { MoodleNetExecutionContext } from '../../../graphql'
import { ActiveUser } from '../../user-auth/arangodb/types'

export const INVALID_TOKEN = Symbol('INVALID_TOKEN')
export type INVALID_TOKEN = typeof INVALID_TOKEN

export type JWTTokenVerification = MoodleNetExecutionContext<'session'> | null | INVALID_TOKEN

export type GQLExecutionContext = MoodleNetExecutionContext<'anon' | 'session'>

export const verifyJwt = ({
  jwtPublicKey,
  jwtVerifyOpts,
  token,
}: {
  token: string
  jwtPublicKey: string
  jwtVerifyOpts: JWT.VerifyOptions
}): JWTTokenVerification => {
  try {
    const sessionCtx = JWT.verify(String(token), jwtPublicKey, jwtVerifyOpts)
    if (typeof sessionCtx !== 'object') {
      return null
    }
    /* FIXME: implement proper checks */
    return sessionCtx as MoodleNetExecutionContext<'session'>
  } catch {
    return INVALID_TOKEN
  }
}

export type JwtPrivateKey = string
export const signJwtActiveUser = ({
  jwtSignOptions,
  jwtPrivateKey,
  user,
}: {
  jwtPrivateKey: JwtPrivateKey
  jwtSignOptions: JWT.SignOptions
  user: ActiveUser
}) => signJwtAny({ jwtSignOptions, jwtPrivateKey, payload: getSessionExecCtx(user) })

export const getSessionExecCtx = (user: ActiveUser): MoodleNetExecutionContext<'session'> => ({
  type: 'session',
  userId: user._id,
  email: user.email,
  username: user.username,
  profileId: user.profileId,
  role: user.role,
})

export const signJwtAny = ({
  jwtSignOptions,
  jwtPrivateKey,
  payload,
}: {
  jwtPrivateKey: JwtPrivateKey
  jwtSignOptions: JWT.SignOptions
  payload: string | Object | Buffer
}) =>
  JWT.sign(payload, jwtPrivateKey, jwtSignOptions) /*  {
    algorithm: 'RS256',
    expiresIn: jwtExpirationSecs,
  }) */
