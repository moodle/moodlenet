import { UserData } from './store/types'

export type SessionToken = string

export type ClientSession = {
  user: UserData
}
