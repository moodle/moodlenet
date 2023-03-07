import { JWTVerifyOptions } from 'jose'

export type Configs = {
  keys: {
    alg: string
    type: string
    private: string
    public: string
  }
}

export type JwtPayload = Record<string, unknown>
export type JwtStdClaims = {
  expirationTime: number | string
  // audience?: string | string[]
  scope?: string | string[]
  subject?: string
  jti?: string
  notBefore?: number | string
  issuedAt?: number
}

export type JwtVerifyOpts = Omit<JWTVerifyOptions, 'algorithms'>
