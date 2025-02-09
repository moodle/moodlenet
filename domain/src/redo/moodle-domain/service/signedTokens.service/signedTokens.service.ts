import { signed_token } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { TYPE_INVALID_TOKEN } from './consts'

export type signedTokens = moo.service<{
  model: moo.model<SignedTokensModel>
}>

type srvTypes = moo.ucServiceTypes<'signedTokens'>

export type SignedTokensModel = {
  [persona in keyof srvTypes]: {
    [ctx in keyof srvTypes[persona]]: {
      [scope in keyof srvTypes[persona][ctx]]: {
        [uc in keyof srvTypes[persona][ctx][scope]]: {
          [tok in keyof srvTypes[persona][ctx][scope][uc]]: {
            validate: moo.model.type.endpoint<
              [
                'query',
                { token: signed_token },
                Either<
                  TYPE_INVALID_TOKEN,
                  {
                    data: srvTypes[persona][ctx][scope][uc][tok]
                  }
                >,
              ]
            >
            sign: moo.model.type.endpoint<
              [
                'query',
                {
                  data: srvTypes[persona][ctx][scope][uc][tok]
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
