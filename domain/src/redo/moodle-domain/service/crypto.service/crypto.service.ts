import { plain_password, signed_token } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { TYPE_INVALID_TOKEN } from './consts'

export type crypto = moo.service<{
  model: moo.model<TokenModel>
  tokens: never
}>

export type TokenModel = {
  serviceToken: {
    [audience_serviceName in keyof moo.Services]: {
      [tokenType in keyof moo.Services[audience_serviceName]['tokens']]: {
        sign: moo.model.type.endpoint<
          ['query', { data: moo.Services[audience_serviceName]['tokens'][tokenType] }, { token: signed_token }]
        >
        validate: moo.model.type.endpoint<
          [
            'query',
            { token: signed_token },
            Either<TYPE_INVALID_TOKEN, { data: moo.Services[audience_serviceName]['tokens'][tokenType] }>,
          ]
        >
      }
    }
  }
  hashing: {
    password: {
      hash: moo.model.type.endpoint<['query', { plainPassword: plain_password }, { hash: string }]>
      verify: moo.model.type.endpoint<['query', { plainPassword: plain_password; hash: string }, { valid: boolean }]>
    }
  }
}
