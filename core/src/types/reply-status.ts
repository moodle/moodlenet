import { _any } from '@moodle/lib/types'

export const status_list_success = [
  // ['Continue', '_100'],
  // ['_witching Protocols', '_101'],
  // ['Processing', '_102'],
  // ['Early Hints', '_103'],
  ['OK', '_200'],
  ['Created', '_201'],
  ['Accepted', '_202'],
  ['Non-Authoritative Information', '_203'],
  ['No Content', '_204'],
  ['Reset Content', '_205'],
  ['Partial Content', '_206'],
  ['Multi-Reply', '_207'],
  ['Already Reported', '_208'],
  ['IM Used', '_226'],
  // ['Multiple Choices', '_300'],
  // ['Moved Permanently', '_301'],
  // ['Found', '_302'],
  // ['_ee Other', '_303'],
  // ['Not Modified', '_304'],
  // ['Use Proxy', '_305'],
  // ['Temporary Redirect', '_307'],
  // ['Permanent Redirect', '_308'],
] as const
export const status_list_fail = [
  ['Bad Request', '_400'],
  ['Unauthorized', '_401'],
  ['Payment Required', '_402'],
  ['Forbidden', '_403'],
  ['Not Found', '_404'],
  ['Method Not Allowed', '_405'],
  ['Not Acceptable', '_406'],
  ['Proxy Authentication Required', '_407'],
  ['Request Timeout', '_408'],
  ['Conflict', '_409'],
  ['Gone', '_410'],
  ['Length Required', '_411'],
  ['Precondition Failed', '_412'],
  ['Payload Too Large', '_413'],
  ['URI Too Long', '_414'],
  ['Unsupported Media Type', '_415'],
  ['Range Not Satisfiable', '_416'],
  ['Expectation Failed', '_417'],
  ["I'm a Teapot", '_418'],
  ['Misdirected Request', '_421'],
  ['Unprocessable Entity', '_422'],
  ['Locked', '_423'],
  ['Failed Dependency', '_424'],
  ['Too Early', '_425'],
  ['Upgrade Required', '_426'],
  ['Precondition Required', '_428'],
  ['Too Many Requests', '_429'],
  ['Request Header Fields Too Large', '_431'],
  ['Unavailable For Legal Reasons', '_451'],
  // ['Internal Server Error', '_500'],
  // ['Not Implemented', '_501'],
  // ['Bad Gateway', '_502'],
  // ['_ervice Unavailable', '_503'],
  // ['Gateway Timeout', '_504'],
  // ['HTTP Version Not Supported', '_505'],
  // ['Variant Also Negotiates', '_506'],
  // ['Insufficient Storage', '_507'],
  // ['Loop Detected', '_508'],
  // ['Bandwidth Limit Exceeded', '_509'],
  // ['Not Extended', '_510'],
  // ['Network Authentication Required', '_511'],
] as const

export function statusByDescOrCodeSuccess(
  code_or_desc: status_desc_success | status_code_success,
): status_code_success {
  return code_or_desc in status_code_by_desc_success
    ? (status_code_by_desc_success as _any)[code_or_desc]
    : code_or_desc in status_desc_by_code_success
      ? code_or_desc
      : (() => {
          throw new Error(`Invalid Success status code or desc: ${code_or_desc}`)
        })()
}
export function statusByDescOrCodeFail(
  code_or_desc: status_desc_fail | status_code_fail,
): status_code_fail {
  return code_or_desc in status_code_by_desc_fail
    ? (status_code_by_desc_fail as _any)[code_or_desc]
    : code_or_desc in status_desc_by_code_fail
      ? code_or_desc
      : (() => {
          throw new Error(`Invalid Fail status code or desc: ${code_or_desc}`)
        })()
}

export function isCodeSuccess(sc: status_code): sc is status_code_success {
  return sc[0] === '_2'
}

export function isCodeFail(sc: status_code): sc is status_code_success {
  return sc[0] === '_4'
}

export const status_code_by_desc_success = Object.fromEntries(status_list_success) as Record<
  status_desc_success,
  status_code_success
>
export const status_desc_by_code_success = Object.fromEntries(
  status_list_success.map(([name, code]) => [code, name]),
) as Record<status_code_success, status_desc_success>

export const status_code_by_desc_fail = Object.fromEntries(status_list_fail) as Record<
  status_desc_fail,
  status_code_fail
>
export const status_desc_by_code_fail = Object.fromEntries(
  status_list_fail.map(([name, code]) => [code, name]),
) as Record<status_code_fail, status_desc_fail>

export type status_desc_success = (typeof status_list_success)[number][0]
export type status_code_success = (typeof status_list_success)[number][1]
export type status_desc_fail = (typeof status_list_fail)[number][0]
export type status_code_fail = (typeof status_list_fail)[number][1]

export type status_code = status_code_success | status_code_fail
