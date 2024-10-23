import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { joseOpts, joseVerify, sign } from '@moodle/lib-jwt-jose'
import { _void, signed_token_payload_data, SIGNED_TOKEN_PAYLOAD_PROP } from '@moodle/lib-types'
import * as argon2 from 'argon2'
import { signedToken } from 'domain/src/modules/crypto/types'
import { ArgonPwdHashOpts } from '../types'

export function crypto_secondary_services_factory({
  joseOpts,
  argonOpts,
}: {
  joseOpts: joseOpts
  argonOpts: ArgonPwdHashOpts
}): secondaryProvider {
  return secondaryCtx => {
    const iam_secondary_adapter: secondaryAdapter = {
      crypto: {
        service: {
          async hashPassword({ plainPassword: { __redacted__: plainPassword } }) {
            const passwordHash = await argon2.hash(plainPassword, argonOpts)
            return { passwordHash }
          },
          async verifyPasswordHash({ passwordHash, plainPassword: { __redacted__: plainPassword } }) {
            const verified = await argon2.verify(passwordHash, plainPassword, argonOpts)
            return [verified, _void]
          },

          async validateSignedToken({ token, type, module }) {
            // FIXME : CHECKS AUDIENCE ETC >>>
            const verifyResult = await joseVerify<signed_token_payload_data<signedToken>>(joseOpts, token)
            if (!verifyResult) {
              return [false, { reason: 'invalid' }]
            }
            const signedTokenData = verifyResult.payload[SIGNED_TOKEN_PAYLOAD_PROP]
            if (!(signedTokenData.type === type && signedTokenData.module === module)) {
              return [false, { reason: 'validatedUnknownType', data: signedTokenData }]
            }

            return [true, { validatedSignedTokenData: signedTokenData }]
          },
          async signDataToken({ data, expiresIn }) {
            const { expireDate, token /* , notBeforeDate */ } = await sign<signed_token_payload_data<signedToken>>({
              joseOpts,
              payload: { [SIGNED_TOKEN_PAYLOAD_PROP]: data },
              expiresIn /*,stdClaims:{} ,opts:{} */,
            })
            return { expires: expireDate, token }
          },
        },
      },
    }
    return iam_secondary_adapter
  }
}
