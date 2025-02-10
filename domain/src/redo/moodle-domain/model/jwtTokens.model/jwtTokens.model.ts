import { signed_token } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { TYPE_INVALID_TOKEN } from './consts'

export type twtTokens = moo.model<JwtTokensModel>

type modelUcTypes = moo.ucModelUcTypes<'jwtTokens'>

export type JwtTokensModel = {
  [persona in keyof modelUcTypes]: {
    [ctx in keyof modelUcTypes[persona]]: {
      [scope in keyof modelUcTypes[persona][ctx]]: {
        [uc in keyof modelUcTypes[persona][ctx][scope]]: {
          [tokType in keyof modelUcTypes[persona][ctx][scope][uc]]: {
            validate: moo.model.type.endpoint<
              [
                'query',
                { token: signed_token },
                Either<
                  TYPE_INVALID_TOKEN,
                  {
                    data: modelUcTypes[persona][ctx][scope][uc][tokType]
                  }
                >,
              ]
            >
            sign: moo.model.type.endpoint<
              [
                'query',
                {
                  data: modelUcTypes[persona][ctx][scope][uc][tokType]
                },
                { token: signed_token },
              ]
            >
          }
        }
      }
    }
  }
}
