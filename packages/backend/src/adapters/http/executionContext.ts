import { MoodleNetExecutionContext } from '@moodlenet/common/lib/executionContext/types'
import { RequestHandler } from 'express'
import { getJwtVerifier, newAnonCtx } from '../lib/executionContext'
import { INVALID_TOKEN } from '../lib/executionContext/JWT'

export const MNExecCtxMiddleware: RequestHandler = (req, _res, next) => {
  const headerToken = req.header('bearer')
  req.mnHttpSessionCtx = getMoodleNetExecutionContext({ headerToken })
  next()
}

export const getMoodleNetExecutionContext = ({
  headerToken,
}: {
  headerToken: string | null | undefined
}): MoodleNetExecutionContext<'anon' | 'session'> => {
  if (!headerToken) {
    return newAnonCtx()
  }
  const verifyJwt = getJwtVerifier()
  const tokenVerification = verifyJwt(headerToken)

  return tokenVerification === INVALID_TOKEN || !tokenVerification ? newAnonCtx() : tokenVerification
}
