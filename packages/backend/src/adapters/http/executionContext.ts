import { RequestHandler } from 'express'
import { VerifyOptions } from 'jsonwebtoken'
import { INVALID_TOKEN, verifyJwt } from '../../lib/auth/jwt'
import { SessionEnv } from '../../lib/auth/types'

export const getMNExecEnvMiddleware =
  ({ jwtPublicKey, jwtVerifyOpts }: { jwtPublicKey: string; jwtVerifyOpts: VerifyOptions }): RequestHandler =>
  (req, _res, next) => {
    const headerToken = req.header('bearer')
    req.mnHttpSessionEnv = {
      authSessionEnv: getSessionEnv({ headerToken, jwtPublicKey, jwtVerifyOpts }),
    }
    console.log({ mnHttpSessionEnv: req.mnHttpSessionEnv })
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
}): SessionEnv | null => {
  if (!headerToken) {
    return null
  }
  const tokenVerification = verifyJwt({ jwtPublicKey, jwtVerifyOpts, token: headerToken })
  // console.log({ tokenVerification })
  return tokenVerification === INVALID_TOKEN ? null : tokenVerification
}
