import { MoodleNet } from '../..'

export type UserAccountRoutes =
  | 'Register-New-Account'
  | 'Change-Account-Email'
  | 'Temp-Email-Session'
  | 'UserAccount-GraphQL-Request'
export const userAccountRoutes = MoodleNet.routes<UserAccountRoutes>()
