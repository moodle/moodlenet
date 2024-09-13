import { sec_factory, sec_impl } from '@moodle/domain'
import { createAlphaNumericId } from '@moodle/lib-id-gen'
import { joseEnv, joseVerify, sign } from '@moodle/lib-jwt-jose'
import { _void } from '@moodle/lib-types'
import { v0_1 as iam_v0_1 } from '@moodle/mod-iam'
import * as argon2 from 'argon2'
export type ArgonPwdHashOpts = Parameters<typeof argon2.hash>[1]
// ArgonPwdHashOpts : {
//   memoryCost: 100000,
//   timeCost: 8,
//   parallelism: 4,
//   type: argon2id,
// }

export function iam({
  joseEnv,
  argonOpts,
}: {
  joseEnv: joseEnv
  argonOpts: ArgonPwdHashOpts
}): sec_factory {
  return ctx => {
    const iam_sec_impl: sec_impl = {
      moodle: {
        iam: {
          v0_1: {
            sec: {
              crypto: {
                async generateUserId() {
                  const id = await createAlphaNumericId()
                  return { id }
                },
                async hashPassword({ plainPassword: { __redacted__: plainPassword } }) {
                  const passwordHash = await argon2.hash(plainPassword, argonOpts)
                  return { passwordHash }
                },
                async verifyUserPasswordHash({
                  passwordHash,
                  plainPassword: { __redacted__: plainPassword },
                }) {
                  const verified = await argon2.verify(passwordHash, plainPassword, argonOpts)
                  return [verified, _void]
                },

                //               async validateSessionToken({ sessionToken }) {
                //                 const verifyResult = await joseVerify<lib_moodle_iam.v0_1.UserData>(joseEnv, sessionToken)
                // if (!verifyResult) {
                //   return [false, { reason: 'invalid' }]
                // }
                // return [true, { type: 'authenticated', user: verifyResult.payload.tokenPayload }]
                //                 const [valid, validationResp] = await validateAuthenticatedUserSession({
                //                   joseEnv,
                //                   sessionToken,
                //                 })
                //                 if (!valid) {
                //                   return [false, { reason: 'invalid' }]
                //                 }
                //                 return [true, validationResp]
                //               },
                async decryptToken({ token }) {
                  // FIXME : CHECKS AUDIENCE ETC >>>
                  const verifyResult = await joseVerify<{
                    [p in tokenPayloadProp]: iam_v0_1.encryptedTokenData
                  }>(joseEnv, token)

                  return verifyResult
                    ? [true, verifyResult.payload[TOKEN_PAYLOAD_PROP]]
                    : [false, _void]
                },
                async encryptToken({ data, expires }) {
                  const token = await sign({
                    joseEnv,
                    payload: { [TOKEN_PAYLOAD_PROP]: data },
                    expirationTime: expires /*,stdClaims:{} ,opts:{} */,
                  })
                  return { encrypted: token }
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
type tokenPayloadProp = 'tokenPayload'
const TOKEN_PAYLOAD_PROP: tokenPayloadProp = 'tokenPayload'
