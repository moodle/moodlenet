export interface AccessStatusSuccess<body> {
  success: true
  name: status_name_success
  code: status_code_success
  body: body
}
export interface AccessStatusFail<body = unknown> {
  success: false
  name: status_name_fail
  code: status_code_fail
  body: body
}

export function statusOk<body>(body: body) {
  return statusSuccess('200', body)
}

export function statusSuccess<body>(
  st: status_name_success | status_code_success,
  body: body,
): AccessStatusSuccess<body> {
  return st in by_name_success
    ? {
        success: true,
        code: by_name_success[st as status_name_success],
        name: st as status_name_success,
        body,
      }
    : st in by_code_success
      ? {
          success: true,
          code: st as status_code_success,
          name: by_code_success[st as status_code_success],
          body,
        }
      : (() => {
          throw new Error(`Invalid status: ${st}`)
        })()
}
export function statusFail<body>(
  st: status_name_fail | status_code_fail,
  body: body,
): AccessStatusFail<body> {
  return st in by_name_fail
    ? {
        success: false,
        code: by_name_fail[st as status_name_fail],
        name: st as status_name_fail,
        body,
      }
    : st in by_code_fail
      ? {
          success: false,
          code: st as status_code_fail,
          name: by_code_fail[st as status_code_fail],
          body,
        }
      : (() => {
          throw new Error(`Invalid status: ${st}`)
        })()
}

export const list = {
  success: [
    // ['Continue', '100'],
    // ['Switching Protocols', '101'],
    // ['Processing', '102'],
    // ['Early Hints', '103'],
    ['OK', '200'],
    ['Created', '201'],
    ['Accepted', '202'],
    ['Non-Authoritative Information', '203'],
    ['No Content', '204'],
    ['Reset Content', '205'],
    ['Partial Content', '206'],
    ['Multi-Status', '207'],
    ['Already Reported', '208'],
    ['IM Used', '226'],
    // ['Multiple Choices', '300'],
    // ['Moved Permanently', '301'],
    // ['Found', '302'],
    // ['See Other', '303'],
    // ['Not Modified', '304'],
    // ['Use Proxy', '305'],
    // ['Temporary Redirect', '307'],
    // ['Permanent Redirect', '308'],
  ] as const,
  fail: [
    ['Bad Request', '400'],
    ['Unauthorized', '401'],
    ['Payment Required', '402'],
    ['Forbidden', '403'],
    ['Not Found', '404'],
    ['Method Not Allowed', '405'],
    ['Not Acceptable', '406'],
    ['Proxy Authentication Required', '407'],
    ['Request Timeout', '408'],
    ['Conflict', '409'],
    ['Gone', '410'],
    ['Length Required', '411'],
    ['Precondition Failed', '412'],
    ['Payload Too Large', '413'],
    ['URI Too Long', '414'],
    ['Unsupported Media Type', '415'],
    ['Range Not Satisfiable', '416'],
    ['Expectation Failed', '417'],
    ["I'm a Teapot", '418'],
    ['Misdirected Request', '421'],
    ['Unprocessable Entity', '422'],
    ['Locked', '423'],
    ['Failed Dependency', '424'],
    ['Too Early', '425'],
    ['Upgrade Required', '426'],
    ['Precondition Required', '428'],
    ['Too Many Requests', '429'],
    ['Request Header Fields Too Large', '431'],
    ['Unavailable For Legal Reasons', '451'],
    ['Internal Server Error', '500'],
    ['Not Implemented', '501'],
    ['Bad Gateway', '502'],
    ['Service Unavailable', '503'],
    ['Gateway Timeout', '504'],
    ['HTTP Version Not Supported', '505'],
    ['Variant Also Negotiates', '506'],
    ['Insufficient Storage', '507'],
    ['Loop Detected', '508'],
    ['Bandwidth Limit Exceeded', '509'],
    ['Not Extended', '510'],
    ['Network Authentication Required', '511'],
  ] as const,
} as const

export const by_name_success = Object.fromEntries(list.success) as Record<
  status_name_success,
  status_code_success
>
export const by_code_success = Object.fromEntries(
  list.success.map(([name, code]) => [code, name]),
) as Record<status_code_success, status_name_success>

export const by_name_fail = Object.fromEntries(list.fail) as Record<
  status_name_fail,
  status_code_fail
>
export const by_code_fail = Object.fromEntries(
  list.fail.map(([name, code]) => [code, name]),
) as Record<status_code_fail, status_name_fail>
export type status_name_success = (typeof list.success)[number][0]
export type status_code_success = (typeof list.success)[number][1]
export type status_name_fail = (typeof list.fail)[number][0]
export type status_code_fail = (typeof list.fail)[number][1]
