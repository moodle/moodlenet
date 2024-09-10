import { _any } from './map'

// redacted logging
export const __redacted__key = '__redacted__'
export function logRedact(obj: _any) {
  return JSON.stringify(
    obj,
    (key, value) => (key === __redacted__key ? '###__redacted__###' : value),
    2,
  )
}
export type __redacted__<T> = { [k in typeof __redacted__key]: T }
//

export type date_time_string = string // ISO 8601
export type date_string = string // ISO 8601
export type time_string = string // ISO 8601
export type time_duration_string = string // human readable duration https://github.com/jkroso/parse-duration

export type email_address = string // email format
export type url = string // URL format

export type _t<t> = { [k in string & keyof t]: t[k] } // utility type to convert string literal to string type
