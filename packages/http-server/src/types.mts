import { PackageInfo } from '@moodlenet/core'
import { Application, default as _express } from 'express'

export type MountAppArgs = {
  getApp(express: typeof _express): Application
  mountOnAbsPath?: string
}
export type MountAppItem = {
  mountAppArgs: MountAppArgs
  pkgInfo: PackageInfo
  mountPath: string
}

export type SessionTokenCookieName = 'mn-session'
// export type SessionTokenHeaderName = SessionTokenCookieName

declare global {
  namespace Express {
    // Inject additional properties on express.Request
    interface Request {
      moodlenet: {
        authToken?: string | undefined
      }
    }
  }
}
