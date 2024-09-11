import { _any } from './map'

export const _never = void 0 as never
export const _void = void 0 as void

// redacted logging
export const __redacted__key = '__redacted__'
export function logRedact(obj: _any) {
  return JSON.stringify(
    obj,
    (key, value) => (key === __redacted__key ? '###__redacted__###' : value),
    2,
  )
}
export function __redacted__<t>(data: t): __redacted__<t> {
  return { [__redacted__key]: data }
}
export type __redacted__<T> = { [k in typeof __redacted__key]: T }
//

export type date_time_string = string // ISO 8601
export function date_time_string(date: Date | 'now'): date_time_string {
  const _date = date === 'now' ? new Date() : date
  return _date.toISOString()
}
export type date_string = string // ISO 8601
export type time_string = string // ISO 8601
export type time_duration_string = string // human readable duration https://github.com/jkroso/parse-duration

export type email_address = string // email format
export type url = string // URL format

export type _t<t> = { [k in string & keyof t]: t[k] } // utility type to convert string literal to string type
