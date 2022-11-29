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
