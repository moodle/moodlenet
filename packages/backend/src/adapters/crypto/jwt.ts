import JWT from 'jsonwebtoken'
import { SockOf } from '../../lib/plug'
import { INVALID_JWT_TOKEN, jwtSignerAdapter, jwtVerifierAdapter } from '../../ports/user-auth/adapters'

export type Config = {
  privateKey: string
  publicKey: string
  signOpts: JWT.SignOptions
  verifyOpts: JWT.VerifyOptions
}
export const getJwtCrypto = ({
  privateKey,
  publicKey,
  verifyOpts,
  signOpts,
}: Config): {
  signer: SockOf<typeof jwtSignerAdapter>
  verifier: SockOf<typeof jwtVerifierAdapter>
} => {
  return {
    signer: async (obj, expiresSec) => JWT.sign(obj, privateKey, { ...signOpts, expiresIn: expiresSec }),
    verifier: async jwt => {
      try {
        const payload = JWT.verify(jwt, publicKey, verifyOpts)
        return payload
      } catch {
        return INVALID_JWT_TOKEN
      }
    },
  }
}
