/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
import { date_time_string, signed_token } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import type { TYPE_INVALID_TOKEN } from './types'
const MODEL_NAME = 'jwtTokens'

type _p = moo.Models.jwtTokens.Payloads
declare global {
  namespace moo {
    interface Models {
      [MODEL_NAME]: jwtTokens
    }
    namespace Models {
      namespace jwtTokens {
        interface Payloads {}
      }
    }
  }
}

export type jwtTokens = moo.model<JwtTokensModel>

export type JwtTokensModel = {
  // validate: moo.model.type.endpoint<['query', { token: signed_token }, Either<TYPE_INVALID_TOKEN, { data: unknown }>]>
  // sign: moo.model.type.endpoint<['query', { data: unknown }, { token: signed_token }]>
  validate: moo.model.op<
    [
      'query',
      <ns extends keyof _p, type extends keyof _p[ns]>(_: {
        ns: ns
        type: type
        token: signed_token
      }) => Promise<
        Either<
          TYPE_INVALID_TOKEN,
          {
            data: _p[ns][type]
          }
        >
      >,
    ]
  >
  sign: moo.model.op<
    [
      'query',
      <ns extends keyof _p, type extends keyof _p[ns]>(_: {
        ns: ns
        type: type
        data: _p[ns][type]
        expires: date_time_string
        opts?: jwtSignOpts
      }) => Promise<{ token: signed_token }>,
    ]
  >
}
export type jwtSignOpts = {
  // audience?: string | string[]
  scope?: string | string[]
  subject?: string
  jti?: string
  notBefore?: date_time_string
  issuedAt?: date_time_string
}

//type time_or_duration = d_u<{ duration: { duration: time_duration_string }; date: { date: date_time_string } }, 'time'>
