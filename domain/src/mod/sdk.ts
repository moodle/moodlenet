import { d_t_u } from '@moodle/t-utils'
import { domain, mod } from './types'

type kind_pusher<_mods extends domain, kind extends keyof mod<any>> = <
  // _mod_name extends keyof _mods,
  // _mod extends _mods[_mod_name],
  // _ch_name extends keyof _mod[kind],
  // _ch extends _mod[kind][_ch_name] & ch,
  // _ch_msgs extends _ch['msg'],
  // _msg_name extends _ch_msgs[_ddp],
  // _msg extends _ch_msgs & {
  //   [n in _ddp]: _msg_name
  // },
  //----//
  _mod_name extends keyof _mods,
  _ch_name extends keyof _mods[_mod_name][kind],
  _msg_name extends keyof _mods[_mod_name][kind][_ch_name]['msg'],
  _msg extends _mods[_mod_name][kind][_ch_name]['msg'][_msg_name],
  // payload extends _msg['payload'],
  // reply extends _msg['reply'],
>(
  mod: _mod_name,
  ch: _ch_name,
  msg: _msg_name,
  // tgt: ev['op']['t'] ,,
  payload: _msg['payload'],
) => Promise<access_status<_msg['reply']>>

export type pusher<_mods extends domain> = <kind extends keyof mod<any>>(
  k: kind,
) => kind_pusher<_mods, kind>
export type priAccess<_mods extends domain> = kind_pusher<_mods, 'receives'>
export type secAccess<_mods extends domain> = kind_pusher<_mods, 'sends'>
export type modEmitter<_mods extends domain> = kind_pusher<_mods, 'emits'>


export type ctrl<_mods extends domain> = handle<_mods, 'receives'>
export type handle<_mods extends domain, kind extends keyof mod<any>> = {
  [mod_name in keyof _mods]: mod_handle<_mods[mod_name], kind>
}

export type mod_ctrl<_mod extends mod<any>> = mod_handle<_mod, 'receives'>

export type mod_handle<_mod extends mod<any>, kind extends keyof mod<any>> = {
  [ch_name in keyof _mod[kind]]: {
    [msg_name in keyof _mod[kind][ch_name]['msg']]: (
      payload: _mod[kind][ch_name]['msg'][msg_name]['payload'],
    ) => Promise<_mod[kind][ch_name]['msg'][msg_name]['reply']>
    // ) => Promise<access_status<_mods[mod_name][kind][ch_name]['msg'][msg_name]['reply']>>
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
