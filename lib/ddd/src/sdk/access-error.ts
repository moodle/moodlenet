import { _any, _unchecked_brand, branded } from '@moodle/lib-types'
import {
  statusXxx,
  status_code_xxx,
  status_desc_by_code_xxx,
  status_desc_xxx,
} from './access-error-status'

declare const error_xxx_brand: unique symbol
export type errorXxx = branded<
  {
    code: status_code_xxx
    desc: status_desc_xxx
    details?: _any
  },
  typeof error_xxx_brand
>

// export function errorMsgValidation(details?: _any) {
//   return errorXxx(400, details)
// }

// export function errorUnauthorized(details?: _any) {
//   return errorXxx(401, details)
// }

// export function errorForbidden(details?: _any) {
//   return errorXxx(403, details)
// }

export function errorXxx(code_or_desc: statusXxx, details?: _any): errorXxx {
  const code = statusXxx(code_or_desc)
  const desc = status_desc_by_code_xxx[code]
  return _unchecked_brand<errorXxx>({ code, desc, details })
}

export class ErrorXxx extends Error {
  public errorXxx: errorXxx
  constructor(code_or_desc_or_err: errorXxx | statusXxx, details?: _any) {
    const _errorXxx: errorXxx =
      typeof code_or_desc_or_err === 'object'
        ? { ...code_or_desc_or_err, details }
        : errorXxx(code_or_desc_or_err, details)

    super(
      `Access ErrorXxx ${_errorXxx.code}:[${_errorXxx.desc}]
    ${JSON.stringify(_errorXxx.details ?? 'no details')}`,
    )
    this.errorXxx = _errorXxx
  }
}
