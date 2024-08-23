import { d_m, map } from 't-utils/src/map'

export type mods<mods extends map<mod<any>> = map<mod<any>>> = d_m<mods>

// type mod_def<
//   receives extends map<ch> | undefined = map<ch> | undefined,
//   sends extends map<ch> | undefined = map<ch> | undefined,
//   emits extends map<ch> | undefined = map<ch> | undefined,
// > = {
//   receives?: receives
//   sends?: sends
//   emits?: emits
// }
type mod_def = {
  receives: map<ch>
  emits: map<ch>
  sends: map<ch>
}
export type mod<def extends mod_def> = {
  receives: d_m<def['receives']>
  emits: d_m<def['emits']>
  sends: d_m<def['sends']>
}

export type ch<msg_map extends map<msg> = map<msg>> = {
  // msg: d_u<msg_map, 'name'>
  msg: d_m<msg_map>
}

type msg<p extends payload = payload, r extends m_payload = m_payload> = {
  payload: p
  reply: r
}

export type receive<p extends payload = payload, r extends m_payload = void /* m_payload */> = msg<
  p,
  r
>
export type send<p extends payload = payload, r extends m_payload = void /* m_payload */> = msg<
  p,
  r
>
export type event<p extends payload = payload> = msg<p, void>

export type m_payload = payload | void
export type payload = map
