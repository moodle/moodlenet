import { d_t_u } from '@moodle/lib/types'
import { domain, mod } from './types'

export type access_kind = 'receives' | 'emits' | 'sends'

type kind_pusher<_domain extends domain, kind extends access_kind> = <
  // _mod_name extends keyof _domain,
  // _mod extends _domain[_mod_name],
  // _ch_name extends keyof _mod[kind],
  // _ch extends _mod[kind][_ch_name] & ch,
  // _ch_msgs extends _ch['msg'],
  // _msg_name extends _ch_msgs[_ddp],
  // _msg extends _ch_msgs & {
  //   [n in _ddp]: _msg_name
  // },
  //----//
  _mod_name extends keyof _domain,
  _ch_name extends keyof _domain[_mod_name][kind],
  _msg_name extends keyof _domain[_mod_name][kind][_ch_name]['msg'],
  _msg extends _domain[_mod_name][kind][_ch_name]['msg'][_msg_name],
  // payload extends _msg['payload'],
  // reply extends _msg['reply'],
>(
  mod: _mod_name,
  ch: _ch_name,
  msg: _msg_name,
  // tgt: ev['op']['t'] ,,
  payload: _msg['payload'],
) => Promise<access_status<_msg['reply']>>

export type pusher<_domain extends domain> = <kind extends access_kind>(
  k: kind,
) => kind_pusher<_domain, kind>
export type priAccess<_domain extends domain> = kind_pusher<_domain, 'receives'>
export type secAccess<_domain extends domain> = kind_pusher<_domain, 'sends'>

export type modEmitter<_domain extends domain> = kind_pusher<_domain, 'emits'>

export type ctrl<_domain extends domain> = handle<_domain, 'receives'>
export type handle<_domain extends domain, kind extends access_kind> = {
  [mod_name in keyof _domain]: mod_kind_handle<_domain[mod_name], kind>
}

export type mod_ctrl<_mod extends mod<any>> = mod_kind_handle<_mod, 'receives'>

export type mod_kind_handle<_mod extends mod<any>, kind extends access_kind> = {
  [ch_name in keyof _mod[kind]]: {
    [msg_name in keyof _mod[kind][ch_name]['msg']]: (
      payload: _mod[kind][ch_name]['msg'][msg_name]['payload'],
    ) => Promise<_mod[kind][ch_name]['msg'][msg_name]['reply']>
    // ) => Promise<access_status<_domain[mod_name][kind][ch_name]['msg'][msg_name]['reply']>>
  }
}

export type access_status<r> = d_t_u<AccessStatusErr<r>>
export type err<T = unknown> = T & {
  message?: string
}
export interface AccessStatusErr<reply> {
  // 'ok': reply
  'unauthorized': err<{ erdr: string }>
  'not-found': err<{ exrr: string }>
  'forbidden': err<{ aerr: string }>
}
