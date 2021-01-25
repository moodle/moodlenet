import JWT from 'jsonwebtoken'
import { isMoodleNetExecutionAuth } from './executionContext'
import { MoodleNetExecutionAuth } from './types'

export const INVALID_TOKEN = Symbol('INVALID_TOKEN')
export type INVALID_TOKEN = typeof INVALID_TOKEN

export const signJwt = async ({
  executionAuth,
  opts,
  jwtPrivateKey,
}: {
  executionAuth: MoodleNetExecutionAuth
  jwtPrivateKey: string
  opts: JWT.SignOptions
}) => {
  return JWT.sign(executionAuth, jwtPrivateKey, opts)
}

export type JWTTokenVerification = MoodleNetExecutionAuth | null | INVALID_TOKEN
export const verifyJwt = ({
  jwtPublicKey,
  jwtVerifyOpts,
  token,
}: {
  token: any
  jwtPublicKey: string
  jwtVerifyOpts: JWT.VerifyOptions
}): JWTTokenVerification => {
  console.log({
    jwtPublicKey,
    jwtVerifyOpts,
    token,
  })
  if (!token) {
    return null
  }
  try {
    const executionAuth = JWT.verify(String(token), jwtPublicKey, jwtVerifyOpts)
    if (
      typeof executionAuth !== 'object' ||
      !isMoodleNetExecutionAuth(executionAuth)
    ) {
      return null
    }
    return executionAuth
  } catch {
    return INVALID_TOKEN
  }
}

// $ JWT
