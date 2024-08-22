import { d_u, map } from './map'

export type apps<apps extends map<app<any>> = map<app<any>>> = d_u<apps>

// type app_def<
//   receives extends map<ch> | undefined = map<ch> | undefined,
//   sends extends map<ch> | undefined = map<ch> | undefined,
//   emits extends map<ch> | undefined = map<ch> | undefined,
// > = {
//   receives?: receives
//   sends?: sends
//   emits?: emits
// }
type app_def = {
  receive?: map<ch>
  emit?: map<ch>
  send?: map<ch>
}
export type app<def extends app_def> = {
  receives: d_u<def['receive']>
  emits: d_u<def['emit']>
  sends: d_u<def['send']>
}

export type ch<msg_map extends map<msg> = map<msg>> = {
  msg: d_u<msg_map>
}

type msg<p extends payload = payload, r extends m_payload = m_payload> = {
  payload: p
  reply: r
}

export type receives<p extends payload = payload, r extends m_payload = void /* m_payload */> = msg<
  p,
  r
>
export type sends<p extends payload = payload, r extends m_payload = void /* m_payload */> = msg<
  p,
  r
>
export type event<p extends payload = payload> = msg<p, void>

export type m_payload = payload | void
export type payload = map
