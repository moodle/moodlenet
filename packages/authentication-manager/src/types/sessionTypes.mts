import { UserDocument } from './storeTypes.mjs'
export * from './storeTypes.mjs'

export type UserId = string
export type SessionToken = string

export type ClientSession = UserClientSession | RootClientSession
export type UserClientSession = {
  user: UserDocument
  isRoot?: false
}
export type RootClientSession = {
  isRoot: true
  user?: undefined
}

export type AuthAsyncCtx = {
  currentSession?:
    | { type: 'auth-token-set'; authToken: string }
    | { type: 'client-session-verified'; authToken: string; clientSession: ClientSession }
}
