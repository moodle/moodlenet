import { RequestHandler } from 'express'
import { VerifyOptions } from 'jsonwebtoken'
import { GuestSessionEnv } from '../../lib/auth/env'
import { INVALID_TOKEN, verifyJwt } from '../../lib/auth/jwt'
import { SessionEnv } from '../../lib/auth/types'

export const getMNExecEnvMiddleware =
  ({ jwtPublicKey, jwtVerifyOpts }: { jwtPublicKey: string; jwtVerifyOpts: VerifyOptions }): RequestHandler =>
  (req, _res, next) => {
    const headerToken = req.header('bearer')
    req.mnHttpSessionEnv = getSessionEnv({ headerToken, jwtPublicKey, jwtVerifyOpts })
    next()
  }

export const getSessionEnv = ({
  headerToken,
  jwtPublicKey,
  jwtVerifyOpts,
}: {
  headerToken: string | null | undefined
  jwtPublicKey: string
  jwtVerifyOpts: VerifyOptions
}): SessionEnv => {
  if (!headerToken) {
    return GuestSessionEnv()
  }
  const tokenVerification = verifyJwt({ jwtPublicKey, jwtVerifyOpts, token: headerToken })

  return tokenVerification === INVALID_TOKEN ? GuestSessionEnv() : tokenVerification
}
