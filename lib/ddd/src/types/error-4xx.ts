import { _any, _unchecked_brand, branded } from '@moodle/lib-types'
import {
  status4xx,
  status_code_4xx,
  status_desc_4xx,
  status_desc_by_code_4xx,
} from './reply-status'

declare const error_4xx_brand: unique symbol
export type error4xx = branded<
  {
    code: status_code_4xx
    desc: status_desc_4xx
    details?: _any
  },
  typeof error_4xx_brand
>

export function errorMsgValidation(details?: _any) {
  return error4xx(400, details)
}

export function errorUnauthorized(details?: _any) {
  return error4xx(401, details)
}

export function errorForbidden(details?: _any) {
  return error4xx(403, details)
}

export function error4xx(code_or_desc: status4xx, details?: _any): error4xx {
  const code = status4xx(code_or_desc)
  const desc = status_desc_by_code_4xx[code]
  return _unchecked_brand<error4xx>({ code, desc, details })
}
