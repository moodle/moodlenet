import { _any, deep_partial, map } from '@moodle/lib/types'
import { Modules } from '../domain'
import { part_reply_status_payload_map, reply } from './reply'

export type mod_version = string
export type mod<_mod extends module> = _mod
export type module = {
  // name: string
  [version: mod_version]: layers
}

export type layer_name = keyof layers
export type layers = {
  pri?: map<channels<core_layer>>
  sec?: map<channels<worker_layer>>
  evt?: map<channels<event_layer>>
  prm?: permissions<_any>
}

export type feedback_loop = deep_partial<Modules>

export type permissions<t> = t
export type channels<_layer extends any_layer> = map<_layer>

export type any_layer = event_layer | core_layer | worker_layer
export type msg_payload = object
export type core_layer = (_: msg_payload | never) => reply<part_reply_status_payload_map> | never
export type worker_layer = (_: msg_payload | never) => reply<part_reply_status_payload_map> | never
export type event_layer = (_: msg_payload | never) => never

export type msgs_of<_layer extends any_layer> = [Parameters<_layer>[0], ReturnType<_layer>]
