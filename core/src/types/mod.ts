import { _any, map } from '@moodle/lib/types'
import { layer_contexts } from './concrete'

export type mod_version = string
export type mod<_mod extends module> = _mod
export type module = {
  // name: string
  [version: mod_version]: layers
}

export type layers = {
  pri: map<channels<core_endpoint>>
  sec: map<channels<worker_endpoint>>
  evt: map<channels<event_endpoint>>
  // prm?: map
}

export type channels<_endpoint extends any_endpoint> = map<_endpoint>

export type msg_payload = _any

export type core_endpoint = (_: msg_payload | never) => Promise<msg_payload> | never
export type worker_endpoint = (_: msg_payload | never) => Promise<msg_payload> | never
export type event_endpoint = (_: msg_payload | never) => void
export type any_endpoint = event_endpoint | core_endpoint | worker_endpoint

export type msgs_of<_layer extends any_endpoint> = [Parameters<_layer>[0], ReturnType<_layer>]

// mod access path
export type mod_id = {
  ns: string
  mod: string
  version: string
}
export type mod_endpoint = mod_id & {
  layer: keyof layer_contexts
  channel: string
  port: string
}
export type domain_msg = mod_endpoint & {
  payload: _any
}

export function coreModId({ mod, ns, version }: mod_id): mod_id {
  return { mod, ns, version }
}
