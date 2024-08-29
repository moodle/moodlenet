import { d_m, map } from '@moodle/lib/types'
import { moodle_domain } from '../moodle-domain'

export type domain<_domain extends map<mod<any>> = map<mod<any>>> = d_m<_domain>

type mod_def = {
  // name: string
  version: string
  receives: map<ch>
  emits: map<ch>
  sends: map<ch>
}
export type mod_id<mod_name extends keyof moodle_domain = keyof moodle_domain> = {
  name: mod_name
  version: moodle_domain[mod_name]['version']
}
export type mod<def extends mod_def> = {
  // name: def['name']
  version: def['version']
  receives: d_m<def['receives']>
  emits: d_m<def['emits']>
  sends: d_m<def['sends']>
}

export type ch<msg_map extends map<msg> = map<msg>> = {
  // msg: d_u<msg_map, 'name'>
  msg: d_m<msg_map>
}

type msg<p extends payload = payload, r extends payload = payload> = {
  payload: p
  reply: r
}

export type receive<p extends payload = payload, r extends payload = void /* m_payload */> = msg<
  p,
  r
>
export type send<p extends payload = payload, r extends payload = void /* m_payload */> = msg<p, r>
export type event<p extends payload = payload> = msg<p, void>

export type payload = map | void
