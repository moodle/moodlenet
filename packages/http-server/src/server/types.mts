import { PkgIdentifier } from '@moodlenet/core'
import type { Application, default as _express } from 'express'

export type MountAppItem = {
  getApp(express: typeof _express): Application
  mountOnAbsPath?: string
  pkgId: PkgIdentifier
}

declare module 'express-serve-static-core' {
  export interface Request {
    mnSessionToken?: string
  }
}
