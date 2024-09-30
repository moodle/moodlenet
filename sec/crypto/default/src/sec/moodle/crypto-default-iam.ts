import { iam, moodle_secondary_adapter, moodle_secondary_factory } from '@moodle/domain'
import { joseOpts, joseVerify, sign } from '@moodle/lib-jwt-jose'
import {
  SIGNED_TOKEN_PAYLOAD_PROP,
  _never,
  d_u__d,
  signed_token_payload_data as signed_token_with_payload_data,
} from '@moodle/lib-types'
import * as argon2 from 'argon2'
export type ArgonPwdHashOpts = Parameters<typeof argon2.hash>[1]
// ArgonPwdHashOpts : {
//   memoryCost: 100000,
//   timeCost: 8,
//   parallelism: 4,
//   type: argon2id,
// }

export function iam_crypto_secondary_factory({
  joseOpts,
  argonOpts,
}: {
  joseOpts: joseOpts
  argonOpts: ArgonPwdHashOpts
}): moodle_secondary_factory {
  return (/* ctx */) => {
    const iam_moodle_secondary_adapter: moodle_secondary_adapter = {
      secondary: {
        iam: {
          crypto: {
            async hashPassword({ plainPassword: { __redacted__: plainPassword } }) {
              const passwordHash = await argon2.hash(plainPassword, argonOpts)
              return { passwordHash }
            },
            async verifyUserPasswordHash({
              passwordHash,
              plainPassword: { __redacted__: plainPassword },
            }) {
              const verified = await argon2.verify(passwordHash, plainPassword, argonOpts)
              return [verified, _never]
            },

            async validateSignedToken({ token, type }) {
              // FIXME : CHECKS AUDIENCE ETC >>>
              const verifyResult = await joseVerify<
                signed_token_with_payload_data<d_u__d<iam.signTokenData, 'type', typeof type>>
              >(joseOpts, token)
              if (!verifyResult) {
                return [false, { reason: 'invalid' }]
              }
              const signedTokenData = verifyResult.payload[SIGNED_TOKEN_PAYLOAD_PROP]
              if (signedTokenData.type !== type) {
                return [false, { reason: 'validatedUnknownType', data: signedTokenData }]
              }

              return [true, { validatedSignedTokenData: signedTokenData }]
            },
            async signDataToken({ data, expiresIn }) {
              const { expireDate, token /* , notBeforeDate */ } = await sign<
                signed_token_with_payload_data<iam.signTokenData>
              >({
                joseOpts,
                payload: { [SIGNED_TOKEN_PAYLOAD_PROP]: data },
                expiresIn /*,stdClaims:{} ,opts:{} */,
              })
              return { expires: expireDate, token }
            },
          },
        },
      },
    }
    return iam_moodle_secondary_adapter
  }
}
