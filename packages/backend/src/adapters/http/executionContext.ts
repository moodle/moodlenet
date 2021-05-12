import { MoodleNetExecutionContext } from '@moodlenet/common/lib/executionContext/types'
import { RequestHandler } from 'express'
import { VerifyOptions } from 'jsonwebtoken'
import { INVALID_TOKEN, verifyJwt } from '../../lib/auth/jwt'

export const getMNExecCtxMiddleware =
  ({ jwtPublicKey, jwtVerifyOpts }: { jwtPublicKey: string; jwtVerifyOpts: VerifyOptions }): RequestHandler =>
  (req, _res, next) => {
    const headerToken = req.header('bearer')
    req.mnHttpSessionCtx = getMoodleNetExecutionContext({ headerToken, jwtPublicKey, jwtVerifyOpts })
    next()
  }

export const getMoodleNetExecutionContext = ({
  headerToken,
  jwtPublicKey,
  jwtVerifyOpts,
}: {
  headerToken: string | null | undefined
  jwtPublicKey: string
  jwtVerifyOpts: VerifyOptions
}): MoodleNetExecutionContext<'anon' | 'session'> => {
  if (!headerToken) {
    return { type: 'anon' }
  }
  const tokenVerification = verifyJwt({ jwtPublicKey, jwtVerifyOpts, token: headerToken })

  return tokenVerification === INVALID_TOKEN || !tokenVerification ? { type: 'anon' } : tokenVerification
}
