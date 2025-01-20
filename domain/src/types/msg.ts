import { _any, path } from '@moodle/lib-types'
import { primarySession } from './access-session'
import { ctxTrack } from './concrete'

export type msgPayload = _any

export type domainMsg = {
  endpoint: domainEndpoint
  payload: _any
}
export type domainAccess = domainMsg & {
  domain: string
  primarySession?: primarySession
  callerContext?: ctxTrack
  originEndpoint?: path
  enqueue?: boolean //| asyncOptions
}

// export type asyncOptions = {
//   delay?: time_duration_string
// }

export type domainEndpoint = path

export type binderDispatcher = (_: { domainAccess: domainAccess }) => Promise<_any>

export type binderReceiver = (_: { binderDispatcher: binderDispatcher }) => void
