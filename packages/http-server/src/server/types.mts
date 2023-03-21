import { PkgIdentifier } from '@moodlenet/core'
import type { Application, default as _express, Request, RequestHandler, Response } from 'express'

export type HttpAsyncCtx = {
  currentHttp: {
    request: Request
    response: Response
  }
}

export type MountAppItem = {
  getApp(express: typeof _express): Application
  mountOnAbsPath?: string
  pkgId: PkgIdentifier
}

export type MiddlewareItem = {
  handlers: RequestHandler | RequestHandler[]
  pkgId: PkgIdentifier
}

declare module 'express-serve-static-core' {
  export interface Request {
    mnSessionToken?: string
  }
}
