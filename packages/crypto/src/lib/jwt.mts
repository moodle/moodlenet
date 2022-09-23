import JWT, { SignOptions, VerifyOptions } from 'jsonwebtoken'
import { getKeys } from './utils.mjs'

export type SignArgs = { payload: any; signOpts?: SignOptions }
export async function sign({ payload, signOpts }: SignArgs) {
  const { privateKey } = await getKeys()
  const jwt = JWT.sign(payload, privateKey, signOpts)
  return { jwt }
}

export type VerifyArgs = { jwt: string; verifyOpts?: VerifyOptions }
export async function verify({ jwt, verifyOpts }: VerifyArgs) {
  const { publicKey } = await getKeys()
  const payload = JWT.verify(jwt, publicKey, verifyOpts)
  return { payload }
}
