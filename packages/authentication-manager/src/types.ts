import { UserData } from './store/types'
export * from './store/types'

export type SessionToken = string

export type ClientSession = UserClientSession | RootClientSession
export type UserClientSession = {
  user: UserData
  root?: false
}
export type RootClientSession = {
  root: true
}
