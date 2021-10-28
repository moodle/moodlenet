import { isSessionEnv, SessionEnv } from '@moodlenet/common/lib/types'
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

export const getSessionEnv = async ({
  headerToken,
}: {
  headerToken: string | null | undefined
}): Promise<SessionEnv> => {
  const noAuth: SessionEnv = {
    authId: null,
  }
  if (!headerToken) {
    return noAuth
  }
  const sessionEnv = await jwtVerifierAdapter(headerToken)
  if (sessionEnv === INVALID_JWT_TOKEN) {
    return noAuth
  }
  return isSessionEnv(sessionEnv) ? sessionEnv : noAuth
}
