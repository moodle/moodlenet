import { ReactElement } from 'react'
import _slugify from 'slugify'
import { BRAND, intersection, number, object, string, ZodSchema } from 'zod'
import { _any, d_u } from './map'

export type promise_or_value<t> = t | Promise<t>

export type path = string[]

export type jsonDiff = unknown

export type intersection<types extends _any[]> = pretty<
  types extends [infer t, ...infer rest] ? t & intersection<rest> : unknown
>
export function unreachable_never(_: never, message?: string): never {
  throw new TypeError(`never [${JSON.stringify(_, null, 2)}]${message ? `: ${message}` : ''}`)
}
// export type pretty<t> = keyof t extends infer keyof_t ? { [k in keyof_t & keyof t]: t[k] } : never // this one prettify better, but loses optionals?: props 🤔
// eslint-disable-next-line @typescript-eslint/ban-types
export type pretty<t> = { [k in keyof t]: t[k] } & {} // utility type to convert make more readable maps

export type _maybe<t> = t | _nullish
export type _nullish = undefined | null
export type _falsy = false | _nullish
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

// redacted logging
export const __redacted__key = '__redacted__'
export function __redact_stringify__(obj: _any) {
  return JSON.stringify(obj, (key, value) => (key === __redacted__key ? '###__redacted__###' : value), 2)
}

export function __redact__(data: _any): _any {
  return JSON.parse(__redact_stringify__(data))
}
export function __redacted__<t>(data: t): __redacted__<t> {
  return _unchecked_brand<__redacted__<t>>({ [__redacted__key]: data })
}
export type __redacted__<T> = branded<{ [k in typeof __redacted__key]: T }, typeof __redacted__brand>
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
export const url_path_string_schema = string().trim().pipe(single_line_string_schema).brand<typeof url_path_string_brand>()

// // export const date_time_string_brand = Symbol('date_time_string_brand')
// export type date_time_string = z.infer< typeof date_time_string_schema> // ISO 8601
export declare const date_time_string_brand: unique symbol
export type date_time_string = branded<string, typeof date_time_string_brand> // ISO 8601
export const date_time_string_schema = string().trim().datetime().brand<typeof date_time_string_brand>()

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
export const time_duration_string_schema = string().trim().duration().brand<typeof time_duration_string_brand>()

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

export declare const integer_brand: unique symbol
export type integer = branded<number, typeof integer_brand>
export const integer_schema = number().int().brand<typeof integer_brand>()

export declare const positive_integer_brand: unique symbol
export type positive_integer = branded<number, typeof positive_integer_brand>
export const positive_integer_schema = number().int().positive().brand<typeof positive_integer_brand>()

export declare const non_negative_integer_brand: unique symbol
export type non_negative_integer = branded<number, typeof non_negative_integer_brand>
export const non_negative_integer_schema = number().int().nonnegative().brand<typeof non_negative_integer_brand>()

export declare const fraction_brand: unique symbol
export type fraction = branded<number, typeof fraction_brand>
export const fraction_schema = number().min(0).max(1).brand<typeof fraction_brand>()

// // export const email_address_brand = Symbol('email_address_brand')
// export type email_address = z.infer< typeof email_address_schema> // email format
export declare const email_address_brand: unique symbol
export type email_address = branded<string, typeof email_address_brand> // email format
export const email_address_schema = string().toLowerCase().trim().email().brand<typeof email_address_brand>()

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
  return arr.filter(isNotFalsy)
}

export function isNotFalsy<t>(el: t | _falsy): el is t {
  return el !== false && isNotNullish(el)
}

export function filterOutNullishes<t>(arr: (t | _nullish)[]): t[] {
  return arr.filter(isNotNullish)
}

export function isNotNullish<t>(el: t | _nullish): el is t {
  return el !== null && el !== undefined
}

export type flags<names extends string> = Record<names, boolean>



// SHAREDLIB
// FIXME: here's not the best place for type `email_body`
export type email_body = d_u<
  {
    react: {
      element: ReactElement
    }
    text: {
      text: string
    }
    html: {
      html: string
      // opts?: check @react-email/render Options @react-email/render/dist/browser/index.d.ts#3
    }
  },
  'contentType'
>

export function webSlug(str: string, opts?: { locale?: string }) {
  const slug = _slugify(str ?? '', { locale: opts?.locale, lower: true, strict: true }) || '-'
  return slug.substring(0, 75)
}

// //CREDIT: [@grahamaj](https://stackoverflow.com/users/5666581/grahamaj) [so](https://stackoverflow.com/a/71131506/1455910)
// type Explode<T> = keyof T extends infer K
//   ? K extends unknown
//     ? { [I in keyof T]: I extends K ? T[I] : never }
//     : never
//   : never
// type AtMostOne<T> = Explode<Partial<T>>
// type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U]
// type ExactlyOne<T> = AtMostOne<T> & AtLeastOne<T>
