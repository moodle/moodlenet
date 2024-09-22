import { BRAND, string } from 'zod'
import { _any } from './map'

export type _falsy = false | undefined | null
export const _never = void 0 as never
export const _void = void 0 as void
export type primitive = primitive_value | null | undefined
export type primitive_value = string | number | boolean | bigint

export function _unchecked_brand<b extends branded<any, any>>(b: unbranded<b>): b {
  return b as b
}
export type unbranded<b extends branded<any, any>> = { [_ in Exclude<keyof b, symbol>]: b[_] }
export type branded<type, b extends symbol> = BRAND<b> & type extends infer _type
  ? type extends primitive_value
      ? _type
    : _t<_type>
  : // : { [_ in keyof _type]: _type[_] }
    never

export type _t<t> = { [k in string & keyof t]: t[k] } // utility type to convert make more readable maps

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

export function date_time_string(date: Date | 'now'): date_time_string {
  const _date = date === 'now' ? new Date() : date
  return _date.toISOString() as date_time_string
}

export const url_brand = Symbol('url_brand')
export type url_string = branded<string, typeof url_brand> // ISO 8601
export const url_string_schema = string().url().brand(url_brand)

export const date_time_brand = Symbol('date_time_brand')
export type date_time_string = branded<string, typeof date_time_brand> // ISO 8601
export const date_time_string_schema = string().datetime().brand(date_time_brand)

export const date_brand = Symbol('date_brand')
export type date_string = branded<string, typeof date_brand> // ISO 8601
export const date_string_schema = string().date().brand(date_brand)

export const time_brand = Symbol('time_brand')
export type time_string = branded<string, typeof time_brand> // ISO 8601
export const time_string_schema = string().time().brand(time_brand)

export const time_duration_brand = Symbol('time_duration_brand')
export type time_duration_string = branded<string, typeof time_duration_brand> // ISO 8601
export const time_duration_string_schema = string().duration().brand(time_duration_brand)

export const encrypted_token_brand = Symbol('time_duration_brand')
export type encrypted_token = branded<string, typeof encrypted_token_brand> // ISO 8601
export const encrypted_token_schema = string().min(10).max(2048).brand(encrypted_token_brand)

export const email_address_brand = Symbol('email_address_brand')
export type email_address = branded<string, typeof email_address_brand> // email format
export const email_address_schema = string().toLowerCase().email().brand(email_address_brand)

export interface named_email_address {
  address: email_address
  name: string
}
export type named_or_email_address = email_address | named_email_address
export type named_or_email_addresses = named_or_email_address[]

export function namedEmailAddressString(addr: email_address | named_email_address) {
  return typeof addr === 'string' ? addr : `${addr.name} <${addr.address}>`
}

export type url = string // URL format

export function filterOutFalsies<t>(arr: (t | _falsy)[]): t[] {
  return arr.filter((x): x is t => !!x)
}
