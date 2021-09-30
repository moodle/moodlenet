import { SessionEnv } from '@moodlenet/common/lib/types'
import { RequestHandler } from 'express'
import { VerifyOptions } from 'jsonwebtoken'
import { INVALID_TOKEN, verifyJwt } from '../../lib/auth/jwt'

export const getMNExecEnvMiddleware =
  ({ jwtPublicKey, jwtVerifyOpts }: { jwtPublicKey: string; jwtVerifyOpts: VerifyOptions }): RequestHandler =>
  (req, _res, next) => {
    const headerToken = req.header('bearer')
    req.mnHttpContext = {
      authSessionEnv: getSessionEnv({ headerToken, jwtPublicKey, jwtVerifyOpts }),
    }
    // console.log({ mnHttpSessionEnv: req.mnHttpContext })
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
