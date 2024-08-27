import { moodle_domain } from '../types'
import { AccessStatusFail, AccessStatusSuccess } from './access-status'
import { ch, mod, payload } from './types'

export type access_kind = 'receives' | 'emits' | 'sends'

type kind_pusher<kind extends access_kind> = <
  // _mod_name extends keyof moodle_domain,
  // _mod extends moodle_domain[_mod_name],
  // _ch_name extends keyof _mod[kind],
  // _ch extends _mod[kind][_ch_name] & ch,
  // _ch_msgs extends _ch['msg'],
  // _msg_name extends _ch_msgs[_ddp],
  // _msg extends _ch_msgs & {
  //   [n in _ddp]: _msg_name
  // },
  //----//
  _mod_name extends keyof moodle_domain,
  _mod extends moodle_domain[_mod_name],
  _mod_section extends _mod[kind],
  _ch_name extends keyof _mod_section,
  _ch extends _mod_section[_ch_name],
  _ch_msg extends _ch extends ch ? _ch['msg'] : never,
  _msg_name extends keyof _ch_msg,
  _msg extends _ch_msg[_msg_name],
  // payload extends _msg['payload'],
  // reply extends _msg['reply'],
>(
  mod: _mod_name,
  ch: _ch_name,
  msg: _msg_name,
  // tgt: ev['op']['t'] ,,
  payload: _msg['payload'],
) => msg_push_promise<_msg['reply']>

export type msg_push_promise<_p extends payload = payload> = {
  val: Promise<_p>
  raw: Promise<access_status<_p>>
}
export type access_status<reply> = AccessStatusSuccess<reply> | AccessStatusFail
export type pusher = <kind extends access_kind>(k: kind) => kind_pusher<kind>
export type priAccess = kind_pusher<'receives'>
export type secAccess = kind_pusher<'sends'>

export type modEmitter = kind_pusher<'emits'>

export type ctrl = handle<'receives'>
export type handle<kind extends access_kind> = {
  [mod_name in keyof moodle_domain]: mod_kind_handle<moodle_domain[mod_name], kind>
}

export type mod_ctrl<_mod extends mod<any>> = mod_kind_handle<_mod, 'receives'>

export type mod_kind_handle<_mod extends mod<any>, kind extends access_kind> = {
  [ch_name in keyof _mod[kind]]: {
    [msg_name in keyof _mod[kind][ch_name]['msg']]: (
      payload: _mod[kind][ch_name]['msg'][msg_name]['payload'],
    ) => Promise<access_status<_mod[kind][ch_name]['msg'][msg_name]['reply']>>
    // ) => Promise<access_status<moodle_domain[mod_name][kind][ch_name]['msg'][msg_name]['reply']>>
  }
}

// export type access_status<r> = d_t_u<AccessStatusErr<r>>
// export type err<T = unknown> = T & {
//   message?: string
// }
// export interface AccessStatusErr<reply> {
//   // 'ok': reply
//   'unauthorized': err<{ erdr: string }>
//   'not-found': err<{ exrr: string }>
//   'forbidden': err<{ aerr: string }>
// }
