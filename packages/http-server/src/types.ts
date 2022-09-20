import { ExtDef, ExtName, ExtVersion, SubcriptionPaths, SubcriptionReq, SubcriptionVal } from '@moodlenet/core'
import { Application } from 'express'

export type PriMsgBaseUrl = `/_/_` //`^^

export type RawSubPriMsgSubUrl = `raw-sub` //`^^
export type RawSubPriMsgBaseUrl = `${PriMsgBaseUrl}/${RawSubPriMsgSubUrl}` //`^^

export type RawSubOpts<Def extends ExtDef, Path extends SubcriptionPaths<Def>> = {
  method: 'POST'
  path: `${RawSubPriMsgBaseUrl}/${ExtName<Def>}/${ExtVersion<Def>}/${Path}`
  req: SubcriptionReq<Def, Path>
  obsType: SubcriptionVal<Def, Path>
  headers: RawSubOptsHeaders
}

export const MN_HTTP_PRI_SUB_LIMIT_HEADER = 'x-mn-http-pri-sub-limit'
export type RawSubOptsHeaders = {
  'content-type': 'application/json'
  [MN_HTTP_PRI_SUB_LIMIT_HEADER]?: number
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
