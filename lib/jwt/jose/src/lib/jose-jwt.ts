import * as jose from 'jose'
import { joseEnv } from './types'
import { _any, time_duration_string } from '@moodle/lib-types'

export async function getJoseKeys(env: joseEnv) {
  if (env.type !== 'PKCS8') {
    throw new Error(`unsupported key type ${env.type} - only PKCS8 supported now`)
  }
  if (env.alg !== 'RS256') {
    throw new Error(`unsupported algorithm ${env.alg} - only RS256 supported now`)
  }

  const [privateKeyLike, publicKeyLike] = await Promise.all([
    jose.importPKCS8(env.privateKeyStr, env.alg),
    jose.importSPKI(env.publicKeyStr, env.alg),
  ])

  const keyLikes = {
    private: privateKeyLike,
    public: publicKeyLike,
  }
  const jwk = await jose.exportJWK(privateKeyLike)
  return { jwk, keyLikes }
}

// FIXME: needs checks on audience, issuer, etc. .. and somehow on payload type
export async function joseVerify<payload>(joseEnv: joseEnv, token: string) {
  const { /* jwk, */ keyLikes } = await getJoseKeys(joseEnv)
  const jwtVerifyResult = await jose.jwtVerify<payload>(token, keyLikes.public).catch(() => null)
  return jwtVerifyResult
}

// interface jose_verify_result<payload> {
//   payload: payload
//   /** JWT Claims Set. */
//   claims: jose.JWTPayload
//   /** JWS Protected Header. */
//   protectedHeader: jose.JWTHeaderParameters
// }
// function get_jose_verify_result<payload>(
//   jwtVerifyResult: jose.JWTVerifyResult<payload>,
// ): jose_verify_result<payload> {
//   const claimSet = ['iss', 'sub', 'aud', 'jti', 'nbf', 'exp', 'iat']

//   const { claims, payload } = Object.keys(jwtVerifyResult.payload).reduce(
//     (acc, key) => {
//       const value = jwtVerifyResult.payload[key]
//       if (claimSet.includes(key)) {
//         acc.claims[key] = value
//       } else {
//         ;(acc.payload as _any)[key] = value
//       }
//       return acc
//     },
//     {
//       payload: {} as payload,
//       claims: {} as jose.JWTPayload,
//     },
//   )
//   return {
//     claims,
//     payload,
//     protectedHeader: jwtVerifyResult.protectedHeader,
//   }
// }

export async function sign<payload>({
  expirationTime,
  payload,
  joseEnv,
  stdClaims = {},
  opts,
}: {
  expirationTime: number | time_duration_string
  joseEnv: joseEnv
  payload: payload
  stdClaims?: JwtStdClaims
  opts?: jose.SignOptions
}) {
  const {/* jwk, */keyLikes} =await  getJoseKeys(joseEnv)
  const _payload: JwtStdClaims & payload = { ...payload as any}
  if (stdClaims.scope !== undefined) {
    _payload.scope = [stdClaims.scope].flat().join(' ')
  }

  const signingJwt = new jose.SignJWT(_payload)
    .setProtectedHeader({ alg: joseEnv.alg })
    .setExpirationTime(expirationTime)

  if (stdClaims.issuer !== undefined) {
    signingJwt.setIssuer(stdClaims.issuer)
  }
  if (stdClaims.audience !== undefined) {
    signingJwt.setAudience(stdClaims.audience)
  }
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

type JwtStdClaims = {
  audience?: string | string[]
  issuer?: string
  scope?: string | string[]
  subject?: string
  jti?: string
  notBefore?: number | string
  issuedAt?: number
}

// type JwtVerifyOpts = Omit<jose.JWTVerifyOptions, 'algorithms'>
// type JwtPayloadCustomClaims = Record<string, unknown>
