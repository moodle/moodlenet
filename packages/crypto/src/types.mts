import * as jose from 'jose'

export type JwtToken = string

export type JwtPayloadCustomClaims = Record<string, unknown>
export type JwtStdClaims = {
  expirationTime: number | string
  // audience?: string | string[]
  scope?: string | string[]
  subject?: string
  jti?: string
  notBefore?: number | string
  issuedAt?: number
}

export type JwtVerifyOpts = Omit<jose.JWTVerifyOptions, 'algorithms'>

export type JwtVerifyResult<CustomClaims extends JwtPayloadCustomClaims> = {
  protectedHeader: jose.JWTVerifyResult['protectedHeader']
  payload: CustomClaims & jose.JWTVerifyResult['payload']
}
