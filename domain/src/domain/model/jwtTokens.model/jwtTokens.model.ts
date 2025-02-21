/* eslint-disable @typescript-eslint/no-namespace */
import { signed_token } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import type { configs, TYPE_INVALID_TOKEN } from './types'
declare global {
  namespace moo {
    interface Models {
      jwtTokens: jwtTokens
    }
  }
}

export type jwtTokens = moo.model<JwtTokensModel>

type xTypes = moo.model.xTypes.blueprint<'jwtTokens'>

export type JwtTokensModel = {
  [moo.configs]: configs
  // validate: moo.model.type.endpoint<['query', { token: signed_token }, Either<TYPE_INVALID_TOKEN, { data: unknown }>]>
  // sign: moo.model.type.endpoint<['query', { data: unknown }, { token: signed_token }]>
  xModel: {
    [xModel in keyof xTypes]: {
      [tokType in keyof xTypes[xModel]]: {
        validate: moo.model.type.endpoint<
          [
            'query',
            { token: signed_token },
            Either<
              TYPE_INVALID_TOKEN,
              {
                data: xTypes[xModel][tokType]
              }
            >,
          ]
        >
        sign: moo.model.type.endpoint<
          [
            'query',
            {
              data: xTypes[xModel][tokType]
            },
            { token: signed_token },
          ]
        >
      }
    }
  }
}
