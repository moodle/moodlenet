import { _any, _unchecked_brand, branded } from '@moodle/lib-types'
import {
  statusXxx,
  status_code_xxx,
  status_desc_by_code_xxx,
  status_desc_xxx,
} from './reply-status'

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
  constructor(public errorXxx: errorXxx) {
    super(
      `Access ErrorXxx ${errorXxx.code}:[${errorXxx.desc}]
    ${JSON.stringify(errorXxx.details ?? 'no details')}`,
    )
  }
}
