import JWT from 'jsonwebtoken'
import { SockOf } from '../../lib/plug'
import { adapter as signerAdapter } from '../../ports/system/crypto/jwtSigner'
import { adapter as verifiererAdapter, INVALID_JWT_TOKEN } from '../../ports/system/crypto/jwtVerifierAdapter'

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
  signer: SockOf<typeof signerAdapter>
  verifier: SockOf<typeof verifiererAdapter>
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
