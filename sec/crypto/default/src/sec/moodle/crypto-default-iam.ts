import { Error4xx, primary_session, sec_factory, sec_impl, session_token } from '@moodle/domain'
import { createAlphaNumericId } from '@moodle/lib-id-gen'
import { joseEnv, joseVerify, sign } from '@moodle/lib-jwt-jose'
import { _void } from '@moodle/lib-types'
import { v0_1 as iam_v0_1 } from '@moodle/mod-iam'
import * as argon2 from 'argon2'
import assert from 'assert'
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
                async assertAuthenticatedUserSession({ token_or_session, onFail }) {
                  const userSession = await getUserSession(joseEnv, token_or_session)
                  assert(
                    userSession.type === 'authenticated',
                    new Error4xx(onFail?.code_or_desc ?? 'Unauthorized', onFail?.details),
                  )
                  return userSession
                },
                async getUserSession({ token_or_session }) {
                  const userSession = await getUserSession(joseEnv, token_or_session)
                  return { userSession }
                },
                async decryptToken({ token }) {
                  const verifyResult = await joseVerify<iam_v0_1.encryptedTokenData>(joseEnv, token)

                  return verifyResult ? [true, verifyResult.payload] : [false, _void]
                },
                async encryptToken({ data, expires }) {
                  const token = await sign({
                    joseEnv,
                    payload: data,
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
const guest_session: iam_v0_1.user_session = {
  type: 'guest',
}

async function getUserSession(
  joseEnv: joseEnv,
  _token_or_session: session_token | primary_session,
): Promise<iam_v0_1.user_session> {
  const token =
    typeof _token_or_session === 'string'
      ? _token_or_session
      : _token_or_session.type === 'user'
        ? _token_or_session.authToken
        : null
  if (!token) {
    return guest_session
  }
  const verifyResult = await joseVerify<iam_v0_1.UserData>(joseEnv, token)
  if (!verifyResult) {
    return guest_session
  }
  return {
    type: 'authenticated',
    user: verifyResult.payload,
  }
}
