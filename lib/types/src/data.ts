import { JsonRecord } from 'fp-ts/Json'
import type {} from 'moment'
import { ReactElement } from 'react'
import _slugify from 'slugify'
import { BRAND, number, object, string, ZodNullable, ZodSchema, ZodString } from 'zod'
import { d_u, map } from './map'
export type promiseOrValue<t> = t | Promise<t>
export type wideProvider<t, args extends any_[] = never> = promiseOrValue<t> | ((..._: args) => promiseOrValue<t>)

export type dmesg_<type extends string, details extends JsonRecord | unknown = unknown> = diagnosticMessage<type, details>
export type diagnosticMessage<message extends string, details extends JsonRecord | unknown = unknown> = details & {
  message: message
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type any_ = any
export type any_key = keyof any_

// eslint-disable-next-line @typescript-eslint/ban-types
export type any_other_string = string & {}

export type promise_or_value<t> = t | Promise<t>

export type path = string[]

export type jsonDiff = unknown

export type union<types extends any_[]> = types extends [infer t, ...infer rest] ? t | intersection<rest> : unknown
export type intersection<types extends any_[]> = types extends [infer t, ...infer rest] ? t & intersection<rest> : unknown

export function unreachable_never(_: never, message?: string | Error): never {
  if (message instanceof Error) {
    throw message
  }
  throw new TypeError(`never [${JSON.stringify(_, null, 2)}]${message ? `: ${message}` : ''}`)
}
// export type pretty<t> = keyof t extends infer keyof_t ? { [k in keyof_t & keyof t]: t[k] } : never // this one prettify better, but loses optionals?: props 🤔
// eslint-disable-next-line @typescript-eslint/ban-types
export type pretty<t> = { [k in keyof t]: t[k] } & {} // utility type to convert make more readable maps
// export type pretty<t> = { [k in keyof t]: t[k] extends primitive ? t[k] : pretty<t[k]> } & {} // utility type to convert make more readable maps

export type maybe<t> = t | nullish
export type nullish = undefined | null
export type falsy_stricter = false | nullish
export type falsy_loosy = '' | 0 | falsy_stricter

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export const void_ = void 0 as void

export type primitive = primitive_value | null | undefined
export type primitive_value = string | number | boolean | bigint

// export type serializable = serializable_primitive | serializable_object | serializable_array
// export type serializable_primitive = string | number | boolean | null | undefined
// export type serializable_object = { [k in string]: serializable }
// export type serializable_array = ReadonlyArray<serializable>

export function unchecked_brand_<b extends branded<any_, any_>>(b: unbranded<b>): b {
  return b as b
}
// export const _BRAND = BRAND
export type branded<type, b extends symbol /*  | string */> = BRAND<b> & type extends infer _type
  ? type extends primitive_value
    ? _type
    : { [_ in keyof _type]: _type[_] }
  : never

export type unbranded<b> = b extends map
  ? {
      [_ in Exclude<keyof b, symbol>]: unbranded<b[_]>
    }
  : b

// redacted logging
export const REDACTED_KEY = '###--redacted--###'
export function redact_stringify(obj: any_) {
  return JSON.stringify(obj, redacted_json_replacer)
}

export function redacted_json_replacer(key: string, value: any_): any_ {
  return key === REDACTED_KEY ? REDACTED_KEY : value
}

export function redacted_value<t>(redacted: redacted<t>): t {
  return redacted[REDACTED_KEY]
}

export function redact__(data: any_): any_ {
  return data === null || typeof data !== 'object' ? data : JSON.parse(redact_stringify(data))
}

export function redacted<t>(data: t): redacted<t> {
  return { [REDACTED_KEY]: data } as redacted<t>
}

export type redacted<T> = branded<{ [k in typeof REDACTED_KEY]: T }, typeof redacted_brand>
export declare const redacted_brand: unique symbol
export function redacted_schema<schema extends ZodSchema>(schema: schema) {
  return object({
    [REDACTED_KEY]: schema,
  }).brand<typeof redacted_brand>()
}


// export declare const plain_password_brand: unique symbol
// export type plain_password = redacted<branded<string, typeof plain_password_brand>>
export type plain_password = redacted<string>
export function plain_password_schema(pwdschema: ZodString) {
  return redacted_schema(pwdschema.pipe(single_line_string_schema))
}

// // export const email_address_brand = Symbol('email_address_brand')
// export type email_address = z.infer< typeof email_address_schema> // email format
export declare const email_address_brand: unique symbol
export type email_address = branded<string, typeof email_address_brand> // email format
export function email_address_schema(emlschema = string()) {
  return string()
    .trim()
    .toLowerCase()
    .email()
    .pipe(emlschema ?? string())
    .brand<typeof email_address_brand>()
}
export interface named_email_address {
  address: email_address
  name: string
}
export type named_or_email_address = email_address | named_email_address
export type named_or_email_addresses = named_or_email_address[]

export function namedEmailAddressString(addr: email_address | named_email_address) {
  return typeof addr === 'string' ? addr : `${addr.name} <${addr.address}>`
}

export type regex_parts = [pattern: string, flags: string]

export const single_line_string_regex_parts: regex_parts = ['^[^\r\n]*$', 'gi']
export const single_line_string_regex = new RegExp(...single_line_string_regex_parts)
export const single_line_string_schema = string().regex(new RegExp(...single_line_string_regex_parts))


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

declare global {
  interface Date {
    toISOString(): date_time_string
  }
}

declare module 'moment' {
  interface Moment {
    toISOString(keepOffset?: boolean): date_time_string
  }
}

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
export type time_duration_string = branded<string, typeof time_duration_string_brand> // ISO 8601 https://www.digi.com/resources/documentation/digidocs/90001488-13/reference/r_iso_8601_duration_format.htm
export const time_duration_string_schema = string().trim().duration().brand<typeof time_duration_string_brand>()
export function time_duration(duration: string): time_duration_string {
  return time_duration_string_schema.parse(duration)
}

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

export declare const int_brand: unique symbol
export type int = branded<number, typeof int_brand>
export const int_schema = number().int().brand<typeof int_brand>()
export const int = int_schema.parse.bind(int_schema)

export declare const i_pos_brand: unique symbol
export type i_pos = branded<number, typeof i_pos_brand>
export const i_pos_schema = number().int().positive().brand<typeof i_pos_brand>()
export const i_pos = i_pos_schema.parse.bind(i_pos_schema)

export declare const i_nat_brand: unique symbol
export type i_nat = branded<number, typeof i_nat_brand>
export const i_nat_schema = number().int().nonnegative().brand<typeof i_nat_brand>()
export const i_nat = i_nat_schema.parse.bind(i_nat_schema)

export declare const fract_brand: unique symbol
export type fract = branded<number, typeof fract_brand>
export const fract_schema = number().min(0).max(1).brand<typeof fract_brand>()
export const fract = fract_schema.parse.bind(fract_schema)

export function filterOutFalsies<t>(arr: (t | falsy_loosy)[]): t[] {
  return arr.filter(isNotFalsy)
}

export function isNotFalsy<t>(el: t | falsy_loosy): el is t {
  return el !== false && isNotNullish(el)
}

export function filterOutNullishes<t>(arr: (t | nullish)[]): t[] {
  return arr.filter(isNotNullish)
}

export function isNotNullish<t>(el: t | nullish): el is t {
  return el !== null && el !== undefined
}

export type flags<names extends string> = Record<names, boolean>

export function zod_m_nullable<zodSchema extends ZodSchema>(
  zodSchema: zodSchema,
  nullable: boolean,
): ZodNullable<zodSchema> {
  return (nullable ? zodSchema.nullable() : zodSchema) as ZodNullable<zodSchema>
}

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
