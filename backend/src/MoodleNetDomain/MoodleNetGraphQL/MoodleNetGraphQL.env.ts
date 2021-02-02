import sshpk from 'sshpk'
import { verifyJwt } from './JWT'
import JWT from 'jsonwebtoken'
import { User } from '../services/ContentGraph/ContentGraph.graphql.gen'
import { ShallowNode } from '../services/ContentGraph/persistence/types'
import { ActiveUserAccount } from '../services/UserAccount/persistence/types'
import { signJwt } from './JWT'
import memo from 'lodash/memoize'
import { MoodleNetExecutionAuth } from './types'
import { Id } from '../services/ContentGraph/graphDefinition/types'

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

  const jwtVerifier = (token: any) =>
    verifyJwt({ jwtPublicKey, jwtVerifyOpts, token })

  return jwtVerifier
})

export const getJwtSigner = memo(() => {
  const jwtPrivateKey = process.env.JWT_PRIVATE_KEY!
  sshpk.parseKey(jwtPrivateKey, 'pem')

  const jwtExpirationSecs = parseInt(String(process.env.JWT_EXPIRATION_SECS))
  if (!isFinite(jwtExpirationSecs)) {
    throw new Error(
      `JWT_EXPIRATION_SECS env var must represent an integer, found "${process.env.JWT_EXPIRATION_SECS}" instead`
    )
  }

  const jwtSignBaseOpts: JWT.SignOptions = {
    algorithm: 'RS256',
    expiresIn: jwtExpirationSecs,
  }

  const jwtSigner = ({
    account,
    opts,
    user,
  }: {
    account: ActiveUserAccount
    user: ShallowNode<User>
    opts?: JWT.SignOptions
  }) => {
    const signOpts: JWT.SignOptions = {
      ...jwtSignBaseOpts,
      ...opts,
    }
    const executionAuth: MoodleNetExecutionAuth = {
      accountId: account._id,
      email: account.email,
      username: account.username,
      displayName: user.displayName,
      userId: user._id as Id,
      role: user.role,
    }

    return signJwt({
      executionAuth,
      jwtPrivateKey,
      opts: signOpts,
    })
  }
  return jwtSigner
})
