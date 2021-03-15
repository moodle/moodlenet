import JWT from 'jsonwebtoken'
import memo from 'lodash/memoize'
import sshpk from 'sshpk'
import { newFlow } from '../../lib/domain/flow'
import { ActiveUserAccount } from '../services/UserAccount/impl/arango/types'
import { signJwt, verifyJwt } from './JWT'
import { MoodleNetExecutionContext } from './types'

export type GQLExecutionContext = MoodleNetExecutionContext<'anon' | 'session'>

export const getJwtVerifier = memo(() => {
  const jwtPublicKey = process.env.JWT_PUBLIC_KEY!
  sshpk.parseKey(jwtPublicKey, 'pem')
  console.log({
    jwtPublicKey,
  })
  const jwtVerifyOpts = {
    // algorithms: ['RS256'],
    // complete: true,
  }

  const jwtVerifier = (token: any) => verifyJwt({ jwtPublicKey, jwtVerifyOpts, token })

  return jwtVerifier
})

export const getJwtSigner = memo(() => {
  const jwtPrivateKey = process.env.JWT_PRIVATE_KEY!
  sshpk.parseKey(jwtPrivateKey, 'pem')

  const jwtExpirationSecs = parseInt(String(process.env.JWT_EXPIRATION_SECS))
  if (!isFinite(jwtExpirationSecs)) {
    throw new Error(
      `JWT_EXPIRATION_SECS env var must represent an integer, found "${process.env.JWT_EXPIRATION_SECS}" instead`,
    )
  }

  const jwtSignBaseOpts: JWT.SignOptions = {
    algorithm: 'RS256',
    expiresIn: jwtExpirationSecs,
  }

  const jwtSigner = ({ account, opts }: { account: ActiveUserAccount; opts?: JWT.SignOptions }) => {
    const signOpts: JWT.SignOptions = {
      ...jwtSignBaseOpts,
      ...opts,
    }
    const sessionCtx: GQLExecutionContext = {
      type: 'session',
      flow: newFlow(['JWT']),
      accountId: account._id,
      email: account.email,
      username: account.username,
      userId: account.userId,
      role: account.role,
    }

    return signJwt({
      sessionCtx,
      jwtPrivateKey,
      opts: signOpts,
    })
  }
  return jwtSigner
})
