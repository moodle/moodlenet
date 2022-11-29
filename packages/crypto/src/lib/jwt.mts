import JWT, { Jwt, JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken'
import { getKeys } from './utils.mjs'

export type SignArgs = { payload: any; signOpts?: SignOptions }
export async function sign({ payload, signOpts }: SignArgs) {
  const { privateKey } = await getKeys()
  const jwt = JWT.sign(payload, privateKey, signOpts)
  return { jwt }
}

export type VerifyArgs = { jwt: string; verifyOpts?: VerifyOptions }
export async function verify({ jwt, verifyOpts }: VerifyArgs): Promise<{
  payload: string | Jwt | JwtPayload
}> {
  const { publicKey } = await getKeys()
  const payload = JWT.verify(jwt, publicKey, verifyOpts)
  return { payload }
}

/**
 * copied followings from @types/jsonwebtoken/index.d.ts
 * otherways getting: The inferred type of 'cryptoPkgApis' cannot be named without a reference to '@moodlenet/crypto/node_modules/@types/jsonwebtoken'. This is likely not portable. A type annotation is necessary.
 */
// export interface JwtHeader {
//   // 'alg': string | Algorithm
//   // 'typ'?: string | undefined
//   // 'cty'?: string | undefined
//   // 'crit'?: Array<string | Exclude<keyof JwtHeader, 'crit'>> | undefined
//   // 'kid'?: string | undefined
//   // 'jku'?: string | undefined
//   // 'x5u'?: string | string[] | undefined
//   // 'x5t#S256'?: string | undefined
//   // 'x5t'?: string | undefined
//   // 'x5c'?: string | string[] | undefined
// }
// export interface JwtPayload {
//   // [key: string]: any
//   // iss?: string | undefined
//   // sub?: string | undefined
//   // aud?: string | string[] | undefined
//   // exp?: number | undefined
//   // nbf?: number | undefined
//   // iat?: number | undefined
//   // jti?: string | undefined
// }

// export interface Jwt {
//   header: JwtHeader
//   payload: JwtPayload | string
//   signature: string
// }
/*
 */
