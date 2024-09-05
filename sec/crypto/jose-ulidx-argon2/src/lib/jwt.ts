import type { JwtPayloadCustomClaims, JwtStdClaims, JwtToken } from '@moodle/mod/crypto'
import * as jose from 'jose'
import { joseKeys } from './utils'

export async function sign({
  payload,
  stdClaims,
  audience,
  alg,
  issuer,
  joseKeys,
  opts = {},
}: {
  payload: JwtPayloadCustomClaims
  stdClaims: JwtStdClaims
  audience: string
  alg: string
  issuer: string
  joseKeys: joseKeys
  opts?: jose.SignOptions
}): Promise<string> {
  const jwtPayload = { ...payload }
  if (stdClaims.scope !== undefined) {
    jwtPayload['scope'] = [stdClaims.scope].flat().join(' ')
  }

  const signingJwt = new jose.SignJWT(jwtPayload)
    .setProtectedHeader({ alg })
    .setExpirationTime(stdClaims.expirationTime)
    .setIssuer(issuer)
    .setAudience(audience)

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
  const jwt = await signingJwt.sign(joseKeys.keyLikes.private, opts)

  return jwt
}

export async function verify({
  jwtToken,
  joseKeys,
  opts,
}: {
  joseKeys: joseKeys
  jwtToken: JwtToken
  opts: jose.JWTVerifyOptions
}): Promise<null | jose.JWTVerifyResult<jose.JWTPayload>> {
  try {
    const jwtRawVerifyResult = await jose.jwtVerify(jwtToken, joseKeys.keyLikes.private, opts)
    return jwtRawVerifyResult
  } catch {
    return null
  }
}

export async function decode({
  jwtToken,
}: {
  jwtToken: JwtToken
}): Promise<null | jose.JWTPayload> {
  try {
    //For an encrypted JWT Claims Set validation and JWE decryption use jose.jwtDecrypt().
    const _unverifiedPayload = jose.decodeJwt(jwtToken)
    return _unverifiedPayload
  } catch {
    return null
  }
}
