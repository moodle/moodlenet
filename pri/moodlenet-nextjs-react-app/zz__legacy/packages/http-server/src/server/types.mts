import type { PkgIdentifier } from '@moodlenet/core'
import type { default as _express, Application, Request, RequestHandler, Response } from 'express'

export type HttpAsyncCtx = {
  currentHttp: {
    request: Request
    response: Response
  }
}

type MPromise<T> = T | Promise<T>
export type MountAppItem = {
  getApp(express: typeof _express): MPromise<Application | undefined>
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
