import { instanceDomain } from '@moodlenet/core'
import * as jose from 'jose'
import { env } from '../init/env.mjs'
import { keyLikes } from '../init/keys.mjs'
import { shell } from '../shell.mjs'
import type { JwtPayloadCustomClaims, JwtStdClaims, JwtToken, JwtVerifyResult } from '../types.mjs'

const alg = env.keys.alg

export async function sign(
  _payload: JwtPayloadCustomClaims,
  stdClaims: JwtStdClaims,
  opts?: jose.SignOptions,
) {
  const payload = { ..._payload }
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
  const jwt = await signingJwt.sign(keyLikes.private, opts)

  return jwt
}

async function rawVerify(
  token: JwtToken,
  opts: jose.JWTVerifyOptions = {},
): Promise<undefined | jose.JWTVerifyResult> {
  try {
    const jwtRawVerifyResult = await jose.jwtVerify(token, keyLikes.private, {
      ...opts,
      issuer: 'issuer' in opts ? opts.issuer : instanceDomain,
    })
    return jwtRawVerifyResult
  } catch {
    return
  }
}

export async function verify<CustomClaims extends JwtPayloadCustomClaims>(
  token: JwtToken,
  validate: (_: any) => _ is CustomClaims,
  opts?: Partial<Omit<jose.JWTVerifyOptions, 'issuer' | 'audience'>>,
): Promise<undefined | JwtVerifyResult<CustomClaims>> {
  const caller = shell.assertCallInitiator()
  const jwtVerifyResult = await rawVerify(token, {
    ...opts,
    issuer: instanceDomain,
    audience: caller.pkgId.name,
  })
  if (!jwtVerifyResult) {
    return
  }
  if (!validate(jwtVerifyResult.payload)) {
    return
  }
  return jwtVerifyResult as JwtVerifyResult<CustomClaims>
}

export async function decode(token: JwtToken): Promise<undefined | jose.JWTPayload> {
  try {
    //For an encrypted JWT Claims Set validation and JWE decryption use jose.jwtDecrypt().
    const _unverifiedPayload = jose.decodeJwt(token)
    return _unverifiedPayload
  } catch {
    return
  }
}
