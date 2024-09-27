import { sec_factory, sec_impl } from '@moodle/lib-ddd'
import { joseOpts, joseVerify, sign } from '@moodle/lib-jwt-jose'
import {
  _never,
  signed_token_payload_data as signed_token_with_payload_data,
  SIGNED_TOKEN_PAYLOAD_PROP,
  d_u__d,
} from '@moodle/lib-types'
import { iamSignTokenData } from '@moodle/mod-iam/v1_0/types'
import * as argon2 from 'argon2'
export type ArgonPwdHashOpts = Parameters<typeof argon2.hash>[1]
// ArgonPwdHashOpts : {
//   memoryCost: 100000,
//   timeCost: 8,
//   parallelism: 4,
//   type: argon2id,
// }

export function iam({
  joseOpts,
  argonOpts,
}: {
  joseOpts: joseOpts
  argonOpts: ArgonPwdHashOpts
}): sec_factory {
  return (/* ctx */) => {
    const iam_sec_impl: sec_impl = {
      moodle: {
        iam: {
          v1_0: {
            sec: {
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
                    signed_token_with_payload_data<d_u__d<iamSignTokenData, 'type', typeof type>>
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
                    signed_token_with_payload_data<iamSignTokenData>
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
        },
      },
    }
    return iam_sec_impl
  }
}
