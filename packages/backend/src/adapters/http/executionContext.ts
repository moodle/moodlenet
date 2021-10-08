import { isSessionEnv, SessionEnv } from '@moodlenet/common/lib/types'
import { RequestHandler } from 'express'
import { INVALID_JWT_TOKEN, jwtVerifierAdapter } from '../../ports/user-auth/adapters'

export const execEnvMiddleware: RequestHandler = async (req, _res, next) => {
  const headerToken = req.header('bearer')
  req.mnHttpContext = {
    authSessionEnv: await getSessionEnv({ headerToken }),
  }
  // console.log({ mnHttpSessionEnv: req.mnHttpContext })
  next()
}

export const getSessionEnv = async ({
  headerToken,
}: {
  headerToken: string | null | undefined
}): Promise<SessionEnv | null> => {
  if (!headerToken) {
    return null
  }
  const sessionEnv = await jwtVerifierAdapter(headerToken)
  if (sessionEnv === INVALID_JWT_TOKEN) {
    return null
  }
  return isSessionEnv(sessionEnv) ? sessionEnv : null
}
