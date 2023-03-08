import { instanceDomain } from '@moodlenet/core'
import * as jose from 'jose'
import { env } from '../init.mjs'
import { shell } from '../shell.mjs'
import { JwtPayload, JwtStdClaims } from '../types.mjs'

const alg = env.keys.alg

export async function sign(_payload: JwtPayload, stdClaims: JwtStdClaims, opts?: jose.SignOptions) {
  const payload = _payload
  const caller = shell.assertCallInitiator()
  if (stdClaims.scope !== undefined) {
    payload.scope = [stdClaims.scope].flat().join(' ')
  }

  const signingJwt = new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .setExpirationTime(stdClaims.expirationTime)
    .setIssuer(instanceDomain)
    .setAudience(caller.pkgId.name)

  if (stdClaims.issuedAt !== undefined) {
    signingJwt.setIssuedAt(stdClaims.issuedAt)
  }
  if (stdClaims.subject !== undefined) {
    signingJwt.setSubject(stdClaims.subject)
  }
  if (stdClaims.jti !== undefined) {
    signingJwt.setJti(stdClaims.jti)
  }
  if (stdClaims.notBefore !== undefined) {
    signingJwt.setNotBefore(stdClaims.notBefore)
  }
  const jwt = await signingJwt.sign(env.keyLikes.private, opts)

  return jwt
}

export async function verify(
  jwt: string,
  opts?: Omit<jose.JWTVerifyOptions, 'issuer' | 'audience'>,
): Promise<{
  payload: jose.JWTPayload
}> {
  const caller = shell.assertCallInitiator()
  const jwtVerifyResult = await jose.jwtVerify(jwt, env.keyLikes.private, {
    ...opts,
    issuer: instanceDomain,
    audience: caller.pkgId.name,
  })
  const payload = jwtVerifyResult.payload
  console.log({ verified: payload })
  return { payload }
}

// const jwt = await sign({ ciccio: 'pllo' })
// setTimeout(async () => {
//   const ver = await verify(jwt, { clockTolerance: 3 }).catch(console.log)
//   console.log({ jwt, ver })
// }, 3000)
// const ver = await verify(jwt)
// console.log({ jwt, ver })
