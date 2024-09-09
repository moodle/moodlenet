export type __redacted__<T> = { __redacted__: T } // just for the purpose of avoid logging

export type date_time_string = string // ISO 8601
export type date_string = string // ISO 8601
export type time_string = string // ISO 8601
export type time_duration_string = string // human readable duration https://github.com/jkroso/parse-duration

export type email_address = string // email format
export type url = string // URL format

export type _t<t> = { [k in string & keyof t]: t[k] } // utility type to convert string literal to string type
