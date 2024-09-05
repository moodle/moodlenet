import { map } from '@moodle/lib/types'

export type JwtToken = string

export type JwtPayloadCustomClaims = map
export type JwtStdClaims = {
  expirationTime: number | string
  audience?: string | string[]
  scope?: string | string[]
  subject?: string
  jti?: string
  notBefore?: number | string
  issuedAt?: number
}

export type JwtVerifyResult<CustomClaims extends JwtPayloadCustomClaims> = CustomClaims &
  JWTPayload & { scope?: string }

//////////////
// export type JoseKeys = { jwk: jose.JWK; keyLikes: { private: jose.KeyLike; public: jose.KeyLike } }
// export type Env = {
//   alg: string
//   type: string
//   private: string
//   public: string
// }
//////////////

// taken from jose/dist/types/types.d.ts
export interface JWTPayload {
  iss?: string
  sub?: string
  aud?: string | string[]
  jti?: string
  nbf?: number
  exp?: number
  iat?: number
  [propName: string]: unknown
}
