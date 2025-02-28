/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
import { signed_token } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import type { jwtTokensConfigs, TYPE_INVALID_TOKEN } from './types'
declare global {
  namespace moo {
    interface Models {
      jwtTokens: jwtTokens
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
  [moo.tags.configs]: jwtTokensConfigs
  // validate: moo.model.type.endpoint<['query', { token: signed_token }, Either<TYPE_INVALID_TOKEN, { data: unknown }>]>
  // sign: moo.model.type.endpoint<['query', { data: unknown }, { token: signed_token }]>
  token: {
    [namespace in keyof moo.Models.jwtTokens.Payloads]: {
      [tokType in keyof moo.Models.jwtTokens.Payloads[namespace]]: {
        validate: moo.model.type.endpoint<
          [
            'query',
            { token: signed_token },
            Either<
              TYPE_INVALID_TOKEN,
              {
                data: moo.Models.jwtTokens.Payloads[namespace][tokType]
              }
            >,
          ]
        >
        sign: moo.model.type.endpoint<
          [
            'query',
            {
              data: moo.Models.jwtTokens.Payloads[namespace][tokType]
            },
            { token: signed_token },
          ]
        >
      }
    }
  }
}
