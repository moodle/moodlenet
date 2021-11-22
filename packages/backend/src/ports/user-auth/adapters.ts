import { GraphNodeIdentifierAuth } from '@moodlenet/common/dist/content-graph/types/node'
import { DistOmit, Maybe } from '@moodlenet/common/dist/utils/types'
import { ns } from '../../lib/ns/namespace'
import { plug } from '../../lib/plug'
import { EmailAddr } from '../system/sendEmail'
import { ActiveUser, UserAuthConfig } from './types'

export const getLatestConfigAdapter = plug<() => Promise<UserAuthConfig>>(ns(module, 'get-latest-config-adapter'))

export const getActiveUserByAuthAdapter = plug<(_: { authId: GraphNodeIdentifierAuth }) => Promise<Maybe<ActiveUser>>>(
  ns(module, 'get-active-user-by-auth-adapter'),
)
export const getActiveUserByEmailAdapter = plug<(_: { email: EmailAddr }) => Promise<Maybe<ActiveUser>>>(
  ns(module, 'get-active-user-by-email-adapter'),
)

export const saveActiveUserAdapter = plug<
  (_: DistOmit<ActiveUser, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ActiveUser | string>
>(ns(module, 'save-active-user-adapter'))

export const changePasswordByAuthIdAdapter = plug<
  (_: { authId: GraphNodeIdentifierAuth; newPassword: string }) => Promise<Maybe<ActiveUser>>
>(ns(module, 'change-password-by-auth-id-adapter'))
