import { memo } from '@moodlenet/common/lib/utils/misc'
import JWT from 'jsonwebtoken'
import sshpk from 'sshpk'
// import { ActiveUser } from '../../services/UserAuth/impl/arango/types'
import { signJwt, verifyJwt } from './JWT'
import { MoodleNetExecutionContext } from './types'

type ActiveUser = any

export type GQLExecutionContext = MoodleNetExecutionContext<'anon' | 'session'>

export const getJwtVerifier = memo(() => {
  const jwtPublicKey = process.env.JWT_PUBLIC_KEY!
  sshpk.parseKey(jwtPublicKey, 'pem')
  // console.log({
  //   jwtPublicKey,
  // })
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

  const jwtSigner = ({ user, opts }: { user: ActiveUser; opts?: JWT.SignOptions }) => {
    const signOpts: JWT.SignOptions = {
      ...jwtSignBaseOpts,
      ...opts,
    }
    const sessionCtx: GQLExecutionContext = {
      type: 'session',
      userId: user._id,
      email: user.email,
      username: user.username,
      profileId: user.profileId,
      role: user.role,
    }

    return signJwt({
      sessionCtx,
      jwtPrivateKey,
      opts: signOpts,
    })
  }
  return jwtSigner
})

export const newAnonCtx = (): MoodleNetExecutionContext<'anon'> => ({ type: 'anon' })
