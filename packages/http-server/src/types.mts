import { PkgIdentifier } from '@moodlenet/core'
import { Application, default as _express } from 'express'

export type MountAppItem = {
  getApp(express: typeof _express): Application
  mountOnAbsPath?: string
  pkgId: PkgIdentifier
}

export type HttpApiResponse = { response: any }
