import {
  ExtDef,
  ExtName,
  ExtVersion,
  SubcriptionPaths,
  SubcriptionReq,
  SubcriptionVal,
  ValueData,
} from '@moodlenet/core'
import { Application } from 'express'

export type PriMsgBaseUrl = `/_/_` //`^^

export type RawSubPriMsgSubUrl = `raw-sub` //`^^
export type RawSubPriMsgBaseUrl = `${PriMsgBaseUrl}/${RawSubPriMsgSubUrl}` //`^^

export type RawSubOpts<Def extends ExtDef, Path extends SubcriptionPaths<Def>> = {
  method: 'POST'
  path: `${RawSubPriMsgBaseUrl}/${ExtName<Def>}/${ExtVersion<Def>}/${Path}`
  req: SubcriptionReq<Def, Path>
  obsType: ValueData<SubcriptionVal<Def, Path>>['value']
  headers: RawSubOptsHeaders
}

export type RawSubOptsHeaders = {
  'content-type': 'application/json'
  'limit'?: number
}
export type MountAppItem = { mountPath: string; getApp(): Application }

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
