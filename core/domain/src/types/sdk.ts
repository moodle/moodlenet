import { moodle_domain } from '../domain'
import { ch, mod, payload } from './domain'
import { reply } from './reply'

export type access_layer = 'receives' | 'emits' | 'sends'

type layer_pusher<layer extends access_layer> = <
  _mod_name extends keyof moodle_domain,
  _mod extends moodle_domain[_mod_name],
  _mod_section extends _mod[layer],
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
  payload: _msg['payload'],
) => msg_push_promise<_msg['reply']>

export type msg_push_promise<_p extends payload = payload> = {
  val: Promise<_p>
  raw: Promise<reply<_p>>
}
export type pusher = <layer extends access_layer>(k: layer) => layer_pusher<layer>
export type priAccess = layer_pusher<'receives'>
export type secAccess = layer_pusher<'sends'>

export type modEmitter = layer_pusher<'emits'>

export type domain_ctrl = domain_handles<'receives'>

export type domain_handles<layer extends access_layer> = {
  [mod_name in keyof moodle_domain]: mod_layer_handle<mod_name, layer>
}

export type mod_ctrl<mod_name extends keyof moodle_domain = keyof moodle_domain> = mod_layer_handle<
  mod_name,
  'receives'
>

export type mod_layer_handle<
  mod_name extends keyof moodle_domain,
  layer extends access_layer,
> = moodle_domain[mod_name] extends infer _mod
  ? _mod extends mod<any>
    ? {
        [_mod_name in mod_name]: {
          [ch_name in keyof _mod[layer]]: {
            [msg_name in keyof _mod[layer][ch_name]['msg']]: (
              payload: _mod[layer][ch_name]['msg'][msg_name]['payload'],
            ) => Promise<reply<_mod[layer][ch_name]['msg'][msg_name]['reply']>>
            // ) => Promise<reply<moodle_domain[mod_name][layer][ch_name]['msg'][msg_name]['reply']>>
          }
        }
      }
    : never
  : never
