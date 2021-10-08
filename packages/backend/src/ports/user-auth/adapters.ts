import { AuthId } from '@moodlenet/common/lib/types'
import { DistOmit, Maybe } from '@moodlenet/common/lib/utils/types'
import { EmailAddr, EmailObj } from '../../adapters/emailSender/types'
import { ns } from '../../lib/ns/namespace'
import { plug, value } from '../../lib/stub/Stub'
import { ActiveUser, UserAuthConfig } from './types'

export const sendEmailAdapter = plug<
  (_: EmailObj) => Promise<{ success: true; emailId: string } | { success: false; error: string }>
>(ns('send-email-adapter'))
export const getLatestConfigAdapter = plug<() => Promise<UserAuthConfig>>(ns('get-latest-config-adapter'))
export const localDomainAdapter = value<string>(ns('local-domain-adapter'))
export const getActiveUserByAuthAdapter = plug<(_: { authId: AuthId }) => Promise<Maybe<ActiveUser>>>(
  ns('get-active-user-by-auth-adapter'),
)
export const getActiveUserByEmailAdapter = plug<(_: { email: EmailAddr }) => Promise<Maybe<ActiveUser>>>(
  ns('get-active-user-by-email-adapter'),
)

export const jwtSignerAdapter = plug<(obj: any, expiresSecs: number) => Promise<string>>(ns('jwt-signer-adapter'))
export const jwtVerifierAdapter = plug<(jwt: string) => Promise<unknown | typeof INVALID_JWT_TOKEN>>(ns('jwt-verifier'))
export const INVALID_JWT_TOKEN = Symbol('INVALID_JWT_TOKEN')

export const changePasswordByAuthIdAdapter = plug<
  (_: { authId: AuthId; newPassword: string }) => Promise<Maybe<ActiveUser>>
>(ns('change-password-by-auth-id-adapter'))

export const passwordHasher = plug<(pwd: string) => Promise<string>>(ns('password-hasher'))
export const passwordVerifier = plug<(_: { plainPwd: string; pwdHash: string }) => Promise<boolean>>(
  ns('password-verifier'),
)

export const saveActiveUserAdapter = plug<
  (_: DistOmit<ActiveUser, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ActiveUser | string>
>(ns('save-active-user-adapter'))
