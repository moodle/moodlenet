import { PkgName } from '@moodlenet/core'

export type UserId = string

export type ProviderId = {
  pkgName: PkgName
  uid: string
}

export type User = UserData & { id: UserId }
export type UserData = {
  providerId: ProviderId
  created: string
}

export type Users = Record<UserId, User>
