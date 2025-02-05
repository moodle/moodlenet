import { signed_token } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import * as moo from 'moodle-domain'
import { TYPE_INVALID_TOKEN } from './consts'

export type crypto = moo.DefService<{
  model: moo.DefModel<TokenModel>
  tokens: never
}>

export type TokenModel = {
  serviceToken: {
    [audience_serviceName in keyof moo.Services]: {
      [tokenType in keyof moo.Services[audience_serviceName]['tokens']]: {
        sign: moo.Endpoint<
          ['query', { data: moo.Services[audience_serviceName]['tokens'][tokenType] }, { token: signed_token }]
        >
        validate: moo.Endpoint<
          [
            'query',
            { token: signed_token },
            Either<TYPE_INVALID_TOKEN, { data: moo.Services[audience_serviceName]['tokens'][tokenType] }>,
          ]
        >
      }
    }
  }
}
