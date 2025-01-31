import { any_, branded } from '@moodle/lib-types'
import assert from 'assert'
import { statusXxx, status_code_xxx, status_desc_by_code_xxx, status_desc_xxx } from './access-error-status'

declare const error_xxx_brand: unique symbol
export type errorXxx = branded<
  {
    code: status_code_xxx
    desc: status_desc_xxx
    details?: any_
  },
  typeof error_xxx_brand
>

// export function errorMsgValidation(details?: any_) {
//   return errorXxx(400, details)
// }

// export function errorUnauthorized(details?: any_) {
//   return errorXxx(401, details)
// }

// export function errorForbidden(details?: any_) {
//   return errorXxx(403, details)
// }

export function errorXxx(code_or_desc: statusXxx, details?: any_): errorXxx {
  const code = statusXxx(code_or_desc)
  const desc = status_desc_by_code_xxx[code]
  return { code, desc, details } as errorXxx
}

export function isErrorXxx(e: unknown): e is ErrorXxx {
  return e instanceof ErrorXxx
}
export class ErrorXxx extends Error {
  public errorXxx: errorXxx
  constructor(code_or_desc_or_err: errorXxx | statusXxx, details?: any_) {
    const _errorXxx: errorXxx =
      typeof code_or_desc_or_err === 'object' ? { ...code_or_desc_or_err, details } : errorXxx(code_or_desc_or_err, details)

    super(
      `Access ErrorXxx ${_errorXxx.code}:[${_errorXxx.desc}]
    ${JSON.stringify(_errorXxx.details ?? 'no details')}`,
    )
    this.errorXxx = _errorXxx
  }
}

export function assertWithErrorXxx<assertionObj>(
  assertionObj: assertionObj,
  code_or_desc: statusXxx,
  details?: any_,
): asserts assertionObj {
  assert(assertionObj, new ErrorXxx(code_or_desc, details))
}
