import {
  any,
  BRAND,
  intersection,
  object,
  string,
  union,
  z,
  ZodObject,
  ZodSchema,
  ZodString,
} from 'zod'
import { _any, map } from './map'

export type _maybe<t> = t | _nil
export type _nil = undefined | null
export type _falsy = false | _nil
// export const _void = void 0 as never // TOO DANGEROUS
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
  return _unchecked_brand<__redacted__<t>>({ [__redacted__key]: data })
}
export type __redacted__<T> = branded<
  { [k in typeof __redacted__key]: T },
  typeof __redacted__brand
>
export declare const __redacted__brand: unique symbol
export function __redacted_schema__<schema extends ZodSchema>(schema: schema) {
  return object({
    [__redacted__key]: schema,
  }).brand<typeof __redacted__brand>()
}

export function date_time_string(date: Date | 'now'): date_time_string {
  const _date = date === 'now' ? new Date() : date
  return _date.toISOString() as date_time_string
}
export const single_line_string_schema = string().regex(/^[^\r\n]*$/gi)

// FIXME: ------
// FIXME: move file_id type and schema in file-server when implemented !
// FIXME: ------

export type url_or_file_id = url_string | file_id
export function url_or_file_id_schema(opts?: {
  intersect?: { url?: ZodString; file_id?: ZodObject<map> }
}) {
  return union([
    intersection(opts?.intersect?.url ?? (any() as unknown as ZodString), url_string_schema),
    intersection(opts?.intersect?.file_id ?? (any() as unknown as ZodObject<map>), file_id_schema),
  ])
}

// // export const file_id_brand = Symbol('file_id_brand')
// export type file_id = z.infer< typeof file_id_schema>
export declare const file_id_brand: unique symbol
type ___file_idx = z.infer<typeof file_id_schema> // FIXME: define all types as z.infer? (check DEV NOTES)
export type file_id = branded<{ id: string }, typeof file_id_brand>
export const file_id_schema = object({ id: string().trim().pipe(single_line_string_schema) }).brand<
  typeof file_id_brand
>()

export async function getFileUrl(url_or_file_id: url_or_file_id) {
  if (typeof url_or_file_id === 'string') {
    return url_or_file_id
  }
  return _unchecked_brand<url_string>(url_or_file_id.id)
}

// FIXME: ------^^^^^^^^^^^^^^^^^^^^^^^^^^^^6
// FIXME: move file_id type and schema in file-server when implemented !
// FIXME: ------^^^^^^^^^^^^^^^^^^^^^^^^^^^^6

// // export const url_string_brand = Symbol('url_string_brand')
// export type url_string = z.infer< typeof url_string_schema>
export declare const url_string_brand: unique symbol
export type url_string = branded<string, typeof url_string_brand>
export const url_string_schema = string()
  .trim()
  .max(2048)
  .url()
  .pipe(single_line_string_schema)
  .brand<typeof url_string_brand>()

// // export const url_string_brand = Symbol('url_string_brand')
// export type url_path_string = z.infer< typeof url_path_string_schema>
export declare const url_path_string_brand: unique symbol
export type url_path_string = branded<string, typeof url_path_string_brand>
export const url_path_string_schema = string()
  .trim()
  .pipe(single_line_string_schema)
  .brand<typeof url_path_string_brand>()

// // export const date_time_string_brand = Symbol('date_time_string_brand')
// export type date_time_string = z.infer< typeof date_time_string_schema> // ISO 8601
export declare const date_time_string_brand: unique symbol
export type date_time_string = branded<string, typeof date_time_string_brand> // ISO 8601
export const date_time_string_schema = string()
  .trim()
  .datetime()
  .brand<typeof date_time_string_brand>()

// // export const date_string_brand = Symbol('date_string_brand')
// export type date_string = z.infer< typeof date_string_schema> // ISO 8601
export declare const date_string_brand: unique symbol
export type date_string = branded<string, typeof date_string_brand> // ISO 8601
export const date_string_schema = string().trim().date().brand<typeof date_string_brand>()

// // export const time_string_brand = Symbol('time_string_brand')
// export type time_string = z.infer< typeof time_string_schema> // ISO 8601
export declare const time_string_brand: unique symbol
export type time_string = branded<string, typeof time_string_brand> // ISO 8601
export const time_string_schema = string().trim().time().brand<typeof time_string_brand>()

// // export const time_duration_string_brand = Symbol('time_duration_string_brand')
// export type time_duration_string = z.infer< typeof time_duration_string_schema> // ISO 8601
export declare const time_duration_string_brand: unique symbol
export type time_duration_string = branded<string, typeof time_duration_string_brand> // ISO 8601
export const time_duration_string_schema = string()
  .trim()
  .duration()
  .brand<typeof time_duration_string_brand>()

// // export const signed_token_brand = Symbol('signed_token_brand')
// export type signed_token = z.infer< typeof signed_token_schema> // .. JWT
export declare const signed_token_brand: unique symbol
export type signed_token = branded<string, typeof signed_token_brand> // .. JWT
export const signed_token_schema = string()
  .trim()
  .min(10)
  .max(4096)
  .pipe(single_line_string_schema)
  .brand<typeof signed_token_brand>()

export type signed_expire_token = {
  token: signed_token
  expires: date_time_string
}

// // export const email_address_brand = Symbol('email_address_brand')
// export type email_address = z.infer< typeof email_address_schema> // email format
export declare const email_address_brand: unique symbol
export type email_address = branded<string, typeof email_address_brand> // email format
export const email_address_schema = string()
  .toLowerCase()
  .trim()
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

export type flags<names extends string> = Record<names, boolean>

