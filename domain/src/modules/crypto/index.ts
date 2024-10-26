import { __redacted__, ok_ko, signed_expire_token, signed_token, time_duration_string } from '@moodle/lib-types'
import { plain_password, signedToken, signedTokenOf, signedTokenType } from './types'

export default interface CryptoDomain {
  event: { crypto: unknown }
  service: { crypto: unknown }
  primary: {
    crypto: unknown
  }
  secondary: {
    crypto: {
      write?: unknown
      sync?: unknown
      query?: unknown
      service: {
        hashPassword(_: { plainPassword: plain_password }): Promise<{ passwordHash: string }>

        verifyPasswordHash(_: { plainPassword: plain_password; passwordHash: string }): Promise<ok_ko<void>>

        validateSignedToken<stt extends signedTokenType>(
          _: stt & {
            token: signed_token
          },
        ): Promise<
          ok_ko<
            { validatedSignedTokenData: signedTokenOf<stt> },
            { invalid: unknown; validatedUnknownType: { data: unknown } }
          >
        >
        //NOTE: implement decodeNoValidateSignedToken(_: { token: session_token }): Promise<ok_ko<{__NOT_VALIDATED_SESSION_TOKEN_DATA__:userAccountSignTokenData}>>
        signDataToken<signedTokenType extends signedToken>(_: {
          data: signedTokenType
          expiresIn: time_duration_string
        }): Promise<signed_expire_token>
      }
    }
  }
}
