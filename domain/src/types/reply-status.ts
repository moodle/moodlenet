import { _any } from '@moodle/lib-types'

export const status_list_2xx = [
  // ['Continue', 100],
  // ['SwitchingProtocols', 101],
  // ['Processing', 102],
  // ['Early Hints', 103],
  ['OK', 200],
  ['Created', 201],
  ['Accepted', 202],
  ['Non-Authoritative Information', 203],
  ['No Content', 204],
  ['Reset Content', 205],
  ['Partial Content', 206],
  ['Multi-Reply', 207],
  ['Already Reported', 208],
  ['IM Used', 226],
  // ['Multiple Choices', 300],
  // ['Moved Permanently', 301],
  // ['Found', 302],
  // [eeOther', 303],
  // ['Not Modified', 304],
  // ['Use Proxy', 305],
  // ['Temporary Redirect', 307],
  // ['Permanent Redirect', 308],
] as const
export const status_list_4xx = [
  ['Bad Request', 400],
  ['Unauthorized', 401],
  ['Payment Required', 402],
  ['Forbidden', 403],
  ['Not Found', 404],
  ['Method Not Allowed', 405],
  ['Not Acceptable', 406],
  ['Proxy Authentication Required', 407],
  ['Request Timeout', 408],
  ['Conflict', 409],
  ['Gone', 410],
  ['Length Required', 411],
  ['Precondition Failed', 412],
  ['Payload Too Large', 413],
  ['URI Too Long', 414],
  ['Unsupported Media Type', 415],
  ['Range Not Satisfiable', 416],
  ['Expectation Failed', 417],
  ["I'm a Teapot", 418],
  ['Misdirected Request', 421],
  ['Unprocessable Entity', 422],
  ['Locked', 423],
  ['Failed Dependency', 424],
  ['Too Early', 425],
  ['Upgrade Required', 426],
  ['Precondition Required', 428],
  ['Too Many Requests', 429],
  ['Request Header Fields Too Large', 431],
  ['Unavailable For Legal Reasons', 451],
  // ['Internal Server Error', 500],
  // ['Not Implemented', 501],
  // ['Bad Gateway', 502],
  // [erviceUnavailable', 503],
  // ['Gateway Timeout', 504],
  // ['HTTP Version Not Supported', 505],
  // ['Variant Also Negotiates', 506],
  // ['Insufficient Storage', 507],
  // ['Loop Detected', 508],
  // ['Bandwidth Limit Exceeded', 509],
  // ['Not Extended', 510],
  // ['Network Authentication Required', 511],
] as const

export const status2xx = statusByDescOrCode2xx
export function statusByDescOrCode2xx(
  code_or_desc: status_desc_2xx | status_code_2xx,
): status_code_2xx {
  return code_or_desc in status_code_by_desc_2xx
    ? (status_code_by_desc_2xx as _any)[code_or_desc]
    : code_or_desc in status_desc_by_code_2xx
      ? code_or_desc
      : (() => {
          throw new Error(`Invalid 2xx status code or desc: ${code_or_desc}`)
        })()
}

export const status4xx = statusByDescOrCode4xx
export function statusByDescOrCode4xx(
  code_or_desc: status_desc_4xx | status_code_4xx,
): status_code_4xx {
  return code_or_desc in status_code_by_desc_4xx
    ? (status_code_by_desc_4xx as _any)[code_or_desc]
    : code_or_desc in status_desc_by_code_4xx
      ? code_or_desc
      : (() => {
          throw new Error(`Invalid 4xx status code or desc: ${code_or_desc}`)
        })()
}

export function isCode2xx(sc: status_code): sc is status_code_2xx {
  return sc >= 200 && sc < 300
}

export function isCode4xx(sc: status_code): sc is status_code_2xx {
  return sc >= 400 && sc < 500
}

export const status_code_by_desc_2xx = Object.fromEntries(status_list_2xx) as Record<
  status_desc_2xx,
  status_code_2xx
>
export const status_desc_by_code_2xx = Object.fromEntries(
  status_list_2xx.map(([name, code]) => [code, name]),
) as Record<status_code_2xx, status_desc_2xx>

export const status_code_by_desc_4xx = Object.fromEntries(status_list_4xx) as Record<
  status_desc_4xx,
  status_code_4xx
>
export const status_desc_by_code_4xx = Object.fromEntries(
  status_list_4xx.map(([name, code]) => [code, name]),
) as Record<status_code_4xx, status_desc_4xx>

export type status_desc_2xx = (typeof status_list_2xx)[number][0]
export type status_code_2xx = (typeof status_list_2xx)[number][1]
export type status_desc_4xx = (typeof status_list_4xx)[number][0]
export type status_code_4xx = (typeof status_list_4xx)[number][1]

export type status_code = status_code_2xx | status_code_4xx
export type status4xx = status_desc_4xx | status_code_4xx
export class Error4xx extends Error {
  public code: status_code_4xx
  public desc: status_desc_4xx
  public Error4xx = true
  constructor(code_or_desc: status4xx, details = '') {
    const _code = status4xx(code_or_desc)
    const _desc = status_desc_by_code_4xx[_code]
    const _details = details ? ` : ${details}` : ''
    super(`${_code}[${_desc}]${_details}`)
    this.code = _code
    this.desc = _desc
  }
}
