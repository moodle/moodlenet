import { _any, path } from '@moodle/lib-types'
import { primarySession } from './access-session'
import { ctx_track } from './concrete'

export type msg_payload = _any

export type domainMsg = {
  endpoint: domain_endpoint
  payload: _any
}
export type domainAccess = domainMsg & {
  primarySession?: primarySession
  ctx_track?: ctx_track
  from?: path
}

export type domain_endpoint = path
export type messageDispatcher = (_: { domainAccess: domainAccess }) => Promise<_any>
