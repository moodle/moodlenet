import { UserData } from './store/types.mjs'
export * from './store/types.mjs'

export type SessionToken = string

export type ClientSession = UserClientSession | RootClientSession
export type UserClientSession = {
  user: UserData
  root?: false
}
export type RootClientSession = {
  root: true
  user?: undefined
}

export type AuthAsyncCtx =
  | { type: 'auth-token-set'; authToken: string }
  | { type: 'client-session-fetched'; authToken: string; clientSession: ClientSession }
