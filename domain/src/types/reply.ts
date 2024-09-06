import { _any, map } from '@moodle/lib-types'
import { status_code, status_code_fail, status_code_success } from './reply-status'

export type reply_success<_st_map extends part_reply_status_payload_map> = reply_payload<_st_map> &
  [status_code_success]
export type reply_fail<_st_map extends part_reply_status_payload_map> = reply_payload<_st_map> &
  [status_code_fail]

export type reply<_st_map extends part_reply_status_payload_map> = reply_holder<
  reply_payload<_st_map>
>
// export function isReplySuccess<_st_map extends part_reply_status_payload_map>(
//   rp: reply_payload<_st_map>,
// ): rp is reply_success<_st_map> {
//   return isCodeSuccess(rp[0] as status_code)
// }

// export function isReplyFail<_st_map extends part_reply_status_payload_map>(
//   rp: reply_payload<_st_map>,
// ): rp is reply_fail<_st_map> {
//   return isCodeFail(rp[0] as status_code)
// }

export type part_reply_status_payload_map = AtLeastOne<reply_status_payload_map> //Partial<reply_status_payload_map>
export type reply_status_payload_map = map<_any, status_code>

//export type reply_payload<payload> = ReplySuccess<payload> | ReplyFail<unknown>
export type reply_payload<_st_map extends part_reply_status_payload_map> = AtMostOne<_st_map>
export type reply_holder<t> = Promise<t>

// thanks [@grahamaj](https://stackoverflow.com/users/5666581/grahamaj) [so](https://stackoverflow.com/a/71131506/1455910)
type Explode<T> = keyof T extends infer K
  ? K extends unknown
    ? { [I in keyof T]: I extends K ? T[I] : never }
    : never
  : never
type AtMostOne<T> = Explode<Partial<T>>
type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U]
type ExactlyOne<T> = AtMostOne<T> & AtLeastOne<T>
