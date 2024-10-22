import { _any, path } from '@moodle/lib-types'
import { primarySession } from './access-session'
import { ctxTrack } from './concrete'

export type msgPayload = _any

export type domainMsg = {
  endpoint: domainEndpoint
  payload: _any
}
export type domainAccess = domainMsg & {
  primarySession?: primarySession
  ctx_track?: ctxTrack
  from?: path
}

export type domainEndpoint = path
export type messageDispatcher = (_: { domainAccess: domainAccess }) => Promise<_any>
