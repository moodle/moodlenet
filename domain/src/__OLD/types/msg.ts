import { any_, path } from '@moodle/lib-types'
import { primarySession } from './access-session'
import { ctxTrack } from './concrete'

export type msgPayload = any_

export type domainMsg = {
  endpoint: domainEndpoint
  payload: any_
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

export type binderDispatcher = (_: { domainAccess: domainAccess }) => Promise<any_>

export type binderReceiver = (_: { binderDispatcher: binderDispatcher }) => void
