import { any_ } from '@moodle/lib-types'
import assert from 'assert'
import { status4xx, status_code_4xx, status_desc_4xx, status_desc_by_code_4xx } from './access-error-status'

export type error4xx = {
  code: status_code_4xx
  desc: status_desc_4xx
  details?: any_
}

// export function errorMsgValidation(details?: any_) {
//   return error4xx(400, details)
// }

// export function errorUnauthorized(details?: any_) {
//   return error4xx(401, details)
// }

// export function errorForbidden(details?: any_) {
//   return error4xx(403, details)
// }

export function error4xx(code_or_desc: status4xx, details?: any_): error4xx {
  const code = status4xx(code_or_desc)
  const desc = status_desc_by_code_4xx[code]
  return { code, desc, details } as error4xx
}

export function isError4xx(e: unknown): e is Error4xx {
  return e instanceof Error4xx
}
export class Error4xx extends Error {
  public error4xx: error4xx
  constructor(code_or_desc_or_err: error4xx | status4xx, details?: any_) {
    const _error4xx: error4xx =
      typeof code_or_desc_or_err === 'object' ? { ...code_or_desc_or_err, details } : error4xx(code_or_desc_or_err, details)

    super(
      `Access Error4xx ${_error4xx.code}:[${_error4xx.desc}]
    ${JSON.stringify(_error4xx.details ?? 'no details')}`,
    )
    this.error4xx = _error4xx
  }
}

export function assertWithError4xx<assertionObj>(
  assertionObj: assertionObj,
  code_or_desc: status4xx,
  details?: any_,
): asserts assertionObj {
  assert(assertionObj, new Error4xx(code_or_desc, details))
}
