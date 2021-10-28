import { isGraphNodeIdentifierAuth } from '@moodlenet/common/lib/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/lib/types'
import { pick } from '@moodlenet/common/lib/utils/object'
import { RequestHandler } from 'express'
import { INVALID_JWT_TOKEN, jwtVerifierAdapter } from '../../ports/user-auth/adapters'

export const execEnvMiddleware: RequestHandler = async (req, _res, next) => {
  const headerToken = req.header('bearer')
  req.mnHttpContext = {
    sessionEnv: await getSessionEnv({ headerToken }),
  }
  // console.log({ mnHttpSessionEnv: req.mnHttpContext })
  next()
}

export const getSessionEnv = async ({ headerToken }: { headerToken: string | null | undefined }) => {
  const authId = await getAuthId(headerToken)
  const sessionEnv: SessionEnv = {
    authId,
    timestamp: Number(new Date()),
  }
  return sessionEnv
}

export const getAuthId = async (headerToken: string | null | undefined) => {
  if (!headerToken) {
    return null
  }
  const mAuthId = await jwtVerifierAdapter(headerToken)
  if (mAuthId === INVALID_JWT_TOKEN) {
    return null
  }
  return isGraphNodeIdentifierAuth(mAuthId) ? pick(mAuthId, ['_authKey', '_type']) : null
}
