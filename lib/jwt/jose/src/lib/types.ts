import { getJoseKeys } from './jose-jwt'

export type joseKeys = Awaited<ReturnType<typeof getJoseKeys>>

export type env = {
  alg: string
  type: string
  privateKeyStr: string
  publicKeyStr: string
}
