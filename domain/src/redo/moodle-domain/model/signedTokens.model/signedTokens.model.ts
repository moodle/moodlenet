import { signed_token } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { TYPE_INVALID_TOKEN } from './consts'

export type signedTokens = moo.model<SignedTokensModel>

type modelUcTypes = moo.ucModelUcTypes<'signedTokens'>

export type SignedTokensModel = {
  [persona in keyof modelUcTypes]: {
    [ctx in keyof modelUcTypes[persona]]: {
      [scope in keyof modelUcTypes[persona][ctx]]: {
        [uc in keyof modelUcTypes[persona][ctx][scope]]: {
          [tok in keyof modelUcTypes[persona][ctx][scope][uc]]: {
            validate: moo.model.type.endpoint<
              [
                'query',
                { token: signed_token },
                Either<
                  TYPE_INVALID_TOKEN,
                  {
                    data: modelUcTypes[persona][ctx][scope][uc][tok]
                  }
                >,
              ]
            >
            sign: moo.model.type.endpoint<
              [
                'query',
                {
                  data: modelUcTypes[persona][ctx][scope][uc][tok]
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
