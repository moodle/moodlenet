import JWT from 'jsonwebtoken'
import { MoodleNetExecutionContext } from './types'

export const INVALID_TOKEN = Symbol('INVALID_TOKEN')
export type INVALID_TOKEN = typeof INVALID_TOKEN

export const signJwt = async ({
  sessionCtx,
  opts,
  jwtPrivateKey,
}: {
  sessionCtx: MoodleNetExecutionContext<'session'>
  jwtPrivateKey: string
  opts: JWT.SignOptions
}) => {
  const jwt = JWT.sign(sessionCtx, jwtPrivateKey, opts)
  return jwt
}

export type JWTTokenVerification = MoodleNetExecutionContext<'session'> | null | INVALID_TOKEN
export const verifyJwt = ({
  jwtPublicKey,
  jwtVerifyOpts,
  token,
}: {
  token: any
  jwtPublicKey: string
  jwtVerifyOpts: JWT.VerifyOptions
}): JWTTokenVerification => {
  // console.log({
  //   jwtPublicKey,
  //   jwtVerifyOpts,
  //   token,
  // })
  if (!token) {
    return null
  }
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

// $ JWT
