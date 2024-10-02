import { _any, map } from '@moodle/lib-types'

export type primary_layer = map<channel<primary_endpoint>>
export type secondary_layer = map<channel<secondary_endpoint>>
export type event_layer = map<channel<event_endpoint>>

export type any_layer = primary_layer | secondary_layer | event_layer

export type channel<_endpoint extends any_endpoint> = map<_endpoint>

export type msg_payload = _any

export type primary_endpoint = (_: msg_payload | never) => Promise<msg_payload | void>
export type secondary_endpoint = (_: msg_payload | never) => Promise<msg_payload | void>
export type event_endpoint = (_: msg_payload | never) => unknown

export type any_endpoint = event_endpoint | primary_endpoint | secondary_endpoint

export type domain_msg = {
  endpoint: domain_endpoint
  payload: _any
}

export type domain_endpoint = {
  layer: string
  module: string
  channel: string
  name: string
}
