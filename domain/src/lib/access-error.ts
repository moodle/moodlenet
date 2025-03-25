/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { any_, redact_stringify } from '@moodle/lib-types'
import assert from 'assert'
import { ZodFormattedError } from 'zod'
import { status4xx, status_code_4xx, status_desc_4xx, status_desc_by_code_4xx } from './access-error-status'

export interface error4xx {
  code: status_code_4xx
  desc: status_desc_4xx
  details: error4xxDetails
}
export type error4xxDetails = {
  message: string
  zod?: ZodFormattedError<any_>
  [k: string]: any_
}
// export function errorMsgValidation(details?: details) {
//   return error4xx(400, details)
// }

// export function errorUnauthorized(details?: details) {
//   return error4xx(401, details)
// }

// export function errorForbidden(details?: details) {
//   return error4xx(403, details)
// }
export function error4xx(code_or_desc: status4xx, _details?: string | error4xxDetails): error4xx {
  const code = status4xx(code_or_desc)
  const desc = status_desc_by_code_4xx[code]
  const details: error4xxDetails = !_details ? { message: 'no details' } : typeof _details === 'string' ? { message: _details } : _details
  return { code, desc, details }
}

export function isError4xx(e: unknown): e is Error4xx {
  return e instanceof Error4xx
}
export class Error4xx extends Error implements error4xx {
  code: status_code_4xx
  desc: status_desc_4xx
  details: error4xxDetails
  constructor(code_or_desc_or_err: error4xx | status4xx, details?: string | error4xxDetails) {
    const _error4xx: error4xx = typeof code_or_desc_or_err === 'object' ? error4xx(code_or_desc_or_err.code, details) : error4xx(code_or_desc_or_err, details)

    super(
      `Error4xx ${_error4xx.code}:[${_error4xx.desc}]
${redact_stringify(_error4xx.details)}`,
    )
    this.code = _error4xx.code
    this.details = _error4xx.details
    this.desc = _error4xx.desc
  }
}

export function assert4xx<assertionObj>(assertionObj: assertionObj, code_or_desc: status4xx, details?: error4xxDetails): asserts assertionObj {
  assert(assertionObj, new Error4xx(code_or_desc, details))
}
