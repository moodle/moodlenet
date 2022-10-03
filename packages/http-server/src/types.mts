import { PkgIdentifier } from '@moodlenet/core'
import { Application, default as _express } from 'express'

export type MountAppArgs = {
  getApp(express: typeof _express): Application
  mountOnAbsPath?: string
}
export type MountAppItem = {
  mountAppArgs: MountAppArgs
  pkgId: PkgIdentifier<any>
  mountPath: string
}

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

export type HttpApiResponse = { response: any }
