import { sec_factory } from '@moodle/core'
import { hashPwd, verifyPwd } from './lib/argon.js'
import { decode, sign, verify } from './lib/jwt.js'
import { env } from './lib/types'
import { generate } from './lib/ulid.js'
import { audienceByModId, getJoseKeys } from './lib/utils.js'
export async function crypto_factory(env: env): Promise<sec_factory> {
  const joseKeys = await getJoseKeys(env)

  return function factory(ctx) {
    return {
      moodle: {
        crypto: {
          V0_1: {
            sec: {
              jwt: {
                async decode({ jwtToken }) {
                  const payload = await decode({ jwtToken })
                  return { payload }
                },
                async sign({ jwtPayloadCustomClaims, jwtStdClaims }) {
                  const audience = audienceByModId(ctx.core_mod_id)
                  const jwt = await sign({
                    payload: jwtPayloadCustomClaims,
                    stdClaims: jwtStdClaims,
                    alg: env.alg,
                    joseKeys,
                    audience,
                    issuer: env.domain,
                    opts: {},
                  })
                  return { jwt }
                },
                async verify({ jwtToken }) {
                  const audience = audienceByModId(ctx.core_mod_id)
                  const payload = await verify({
                    jwtToken,
                    joseKeys,
                    opts: {
                      audience,
                    },
                  })
                  return { payload }
                },
              },
              pwdHash: {
                async hash({ plainPwd: { __obfuscated__: plainPwd } }) {
                  const hashed = await hashPwd({
                    plainPwd,
                    opts: env.argonOpts,
                  })
                  return { hashed }
                },
                async match({ plainPwd: { __obfuscated__: plainPwd }, pwdHash }) {
                  const matches = await verifyPwd({
                    plainPwd,
                    pwdHash,
                    opts: env.argonOpts,
                  })
                  return { matches }
                },
              },
              ulid: {
                async generate({ onDate }) {
                  const ulid = await generate({ onDate })
                  return { ulid }
                },
              },
            },
          },
        },
      },
    }
  }
}
