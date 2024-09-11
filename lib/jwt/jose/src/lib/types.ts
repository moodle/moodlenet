import { getJoseKeys } from './jose-jwt'

export type joseKeys = Awaited<ReturnType<typeof getJoseKeys>>

export type env = {
  alg: 'RS256' // string - tested only 'RS256' so far
  type: 'PKCS8' // string - supports only 'PKCS8' so far
  privateKeyStr: string
  publicKeyStr: string
}
