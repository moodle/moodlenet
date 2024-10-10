import { _any, map } from '@moodle/lib-types'

export type primary_layer = map<channel<primary_endpoint>>
export type secondary_layer = map<channel<secondary_endpoint>>
export type event_layer = map<channel<event_endpoint>>

export type any_layer = primary_layer | secondary_layer | event_layer

export type watcher<
  primary extends map<primary_layer> = map<primary_layer>,
  secondary extends map<secondary_layer> = map<secondary_layer>,
> = {
  secondary: layer_watcher<secondary>
  primary: layer_watcher<primary>
}

export type layer_watcher<mod_layer extends map<primary_layer | secondary_layer>> = {
  [module in keyof mod_layer]: {
    [channel in keyof mod_layer[module]]: {
      [endpoint in keyof mod_layer[module][channel]]: (
        _: [
          Awaited<ReturnType<mod_layer[module][channel][endpoint]>>,
          Parameters<mod_layer[module][channel][endpoint]>[0],
        ],
      ) => Promise<unknown>
    }
  }
}

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
