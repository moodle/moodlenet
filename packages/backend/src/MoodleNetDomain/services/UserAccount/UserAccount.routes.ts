import { routes } from '../../../lib/domain'
import { MoodleNetDomain } from '../../MoodleNetDomain'

export type UserAccountRoutes =
  | 'Register-New-Account'
  | 'Change-Account-Email'
  | 'Temp-Email-Session'
  | 'UserAccount-GraphQL-Request'
export const userAccountRoutes = routes<MoodleNetDomain, UserAccountRoutes>()
