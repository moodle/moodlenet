import { AuthId } from '@moodlenet/common/lib/types'
import { DistOmit, Maybe } from '@moodlenet/common/lib/utils/types'
import { EmailAddr, EmailObj } from '../../adapters/emailSender/types'
import { ns } from '../../lib/ns/namespace'
import { plug, value } from '../../lib/plug'
import { ActiveUser, UserAuthConfig } from './types'

// TODO: this is a core plug .. move
export const sendEmailAdapter = plug<
  (_: EmailObj) => Promise<{ success: true; emailId: string } | { success: false; error: string }>
>(ns(__dirname, 'send-email-adapter'))
export const getLatestConfigAdapter = plug<() => Promise<UserAuthConfig>>(ns(__dirname, 'get-latest-config-adapter'))

// TODO: this is a core/http plug .. move
export const localDomainAdapter = value<string>(ns(__dirname, 'local-domain-adapter'))

// TODO: this is a core/http plug .. move
export const publicUrlAdapter = value<string>(ns(__dirname, 'public-url-adapter'))

export const getActiveUserByAuthAdapter = plug<(_: { authId: AuthId }) => Promise<Maybe<ActiveUser>>>(
  ns(__dirname, 'get-active-user-by-auth-adapter'),
)
export const getActiveUserByEmailAdapter = plug<(_: { email: EmailAddr }) => Promise<Maybe<ActiveUser>>>(
  ns(__dirname, 'get-active-user-by-email-adapter'),
)

// TODO: this is a crypto plug .. move
export const jwtSignerAdapter = plug<(obj: any, expiresSecs: number) => Promise<string>>(
  ns(__dirname, 'jwt-signer-adapter'),
)

// TODO: this is a crypto plug .. move
export const jwtVerifierAdapter = plug<(jwt: string) => Promise<unknown | typeof INVALID_JWT_TOKEN>>(
  ns(__dirname, 'jwt-verifier'),
)
// TODO: this is a crypto plug .. move
export const INVALID_JWT_TOKEN = Symbol('INVALID_JWT_TOKEN')

export const changePasswordByAuthIdAdapter = plug<
  (_: { authId: AuthId; newPassword: string }) => Promise<Maybe<ActiveUser>>
>(ns(__dirname, 'change-password-by-auth-id-adapter'))

// TODO: this is a crypto plug .. move
export const passwordHasher = plug<(pwd: string) => Promise<string>>(ns(__dirname, 'password-hasher'))

// TODO: this is a crypto plug .. move
export const passwordVerifier = plug<(_: { plainPwd: string; pwdHash: string }) => Promise<boolean>>(
  ns(__dirname, 'password-verifier'),
)

export const saveActiveUserAdapter = plug<
  (_: DistOmit<ActiveUser, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ActiveUser | string>
>(ns(__dirname, 'save-active-user-adapter'))
