import { isGraphNodeIdentifierAuth } from '@moodlenet/common/dist/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/dist/types'
import { pick } from '@moodlenet/common/dist/utils/object'
import { RequestHandler } from 'express'
import { adapter, INVALID_JWT_TOKEN } from '../../ports/system/crypto/jwtVerifierAdapter'

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
  const mAuthId = await adapter(headerToken)
  if (mAuthId === INVALID_JWT_TOKEN) {
    return null
  }
  return isGraphNodeIdentifierAuth(mAuthId) ? pick(mAuthId, ['_authKey', '_type', '_permId']) : null
}
