import { BRAND, string } from 'zod'
import { _any } from './map'

export type _falsy = false | undefined | null
export const _never = void 0 as never
export const _void = void 0 as void
export type primitive = primitive_value | null | undefined
export type primitive_value = string | number | boolean | bigint

export function _unchecked_brand<b extends branded<_any, _any>>(b: unbranded<b>): b {
  return b as b
}
export type unbranded<b extends branded<_any, _any>> = { [_ in Exclude<keyof b, symbol>]: b[_] }
// export const _BRAND = BRAND
export type branded<type, b extends symbol /*  | string */> = BRAND<b> & type extends infer _type
  ? type extends primitive_value
    ? _type
    : { [_ in keyof _type]: _type[_] }
  : never

export type pretty<t> = { [k in keyof t]: t[k] } // utility type to convert make more readable maps

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

// // export const url_string_brand = Symbol('url_string_brand')
// export type url_string = z.infer< typeof url_string_schema>
declare const url_string_brand: unique symbol
export type url_string = branded<string, typeof url_string_brand>
export const url_string_schema = string().url().brand<typeof url_string_brand>()

// // export const url_string_brand = Symbol('url_string_brand')
// export type url_path_string = z.infer< typeof url_path_string_schema>
declare const url_path_string_brand: unique symbol
export type url_path_string = branded<string, typeof url_path_string_brand>
export const url_path_string_schema = string()
  // TODO: a good regex for paths (this is from https://regexr.com/3a19c ) .regex(/^\/(([A-z0-9\-\%]+\/)*[A-z0-9\-\%]+$)?/gim)
  .brand<typeof url_path_string_brand>()

// // export const date_time_string_brand = Symbol('date_time_string_brand')
// export type date_time_string = z.infer< typeof date_time_string_schema> // ISO 8601
declare const date_time_string_brand: unique symbol
export type date_time_string = branded<string, typeof date_time_string_brand> // ISO 8601
export const date_time_string_schema = string().datetime().brand<typeof date_time_string_brand>()

// // export const date_string_brand = Symbol('date_string_brand')
// export type date_string = z.infer< typeof date_string_schema> // ISO 8601
declare const date_string_brand: unique symbol
export type date_string = branded<string, typeof date_string_brand> // ISO 8601
export const date_string_schema = string().date().brand<typeof date_string_brand>()

// // export const time_string_brand = Symbol('time_string_brand')
// export type time_string = z.infer< typeof time_string_schema> // ISO 8601
declare const time_string_brand: unique symbol
export type time_string = branded<string, typeof time_string_brand> // ISO 8601
export const time_string_schema = string().time().brand<typeof time_string_brand>()

// // export const time_duration_string_brand = Symbol('time_duration_string_brand')
// export type time_duration_string = z.infer< typeof time_duration_string_schema> // ISO 8601
declare const time_duration_string_brand: unique symbol
export type time_duration_string = branded<string, typeof time_duration_string_brand> // ISO 8601
export const time_duration_string_schema = string()
  .duration()
  .brand<typeof time_duration_string_brand>()

// // export const signed_token_brand = Symbol('signed_token_brand')
// export type signed_token = z.infer< typeof signed_token_schema> // .. JWT
declare const signed_token_brand: unique symbol
export type signed_token = branded<string, typeof signed_token_brand> // .. JWT
export const signed_token_schema = string().min(10).max(2048).brand<typeof signed_token_brand>()

export type signed_expire_token = {
  token: signed_token
  expires: date_time_string
}

// // export const email_address_brand = Symbol('email_address_brand')
// export type email_address = z.infer< typeof email_address_schema> // email format
declare const email_address_brand: unique symbol
export type email_address = branded<string, typeof email_address_brand> // email format
export const email_address_schema = string()
  .toLowerCase()
  .email()
  .brand<typeof email_address_brand>()

export interface named_email_address {
  address: email_address
  name: string
}
export type named_or_email_address = email_address | named_email_address
export type named_or_email_addresses = named_or_email_address[]

export function namedEmailAddressString(addr: email_address | named_email_address) {
  return typeof addr === 'string' ? addr : `${addr.name} <${addr.address}>`
}

export function filterOutFalsies<t>(arr: (t | _falsy)[]): t[] {
  return arr.filter((x): x is t => !!x)
}
