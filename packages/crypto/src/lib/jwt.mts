import { instanceDomain } from '@moodlenet/core'
import * as jose from 'jose'
import { env } from '../env.mjs'

const alg = env.keys.alg

export async function sign(payload: any, opts?: jose.SignOptions) {
  const jwt = new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuer(instanceDomain)
    .setIssuedAt()
    .setAudience('urn:example:audience')
    .setExpirationTime('2w')
    .sign(env.keyLikes.private, opts)
  return jwt
}

export async function verify(
  jwt: string,
  opts?: jose.JWTVerifyOptions,
): Promise<{
  payload: jose.JWTPayload
}> {
  const jwtVerifyResult = await jose.jwtVerify(jwt, env.keyLikes.private, opts)
  const payload = jwtVerifyResult.payload
  return { payload }
}

// const jwt = await sign({ ciccio: 'pllo' })
// setTimeout(async () => {
//   const ver = await verify(jwt, { clockTolerance: 3 }).catch(console.log)
//   console.log({ jwt, ver })
// }, 3000)
// const ver = await verify(jwt)
// console.log({ jwt, ver })
