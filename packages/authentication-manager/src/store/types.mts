import { PkgName } from '@moodlenet/core'

export type UserId = string

export type ProviderId = {
  pkgName: PkgName
  uid: string
}

export type User = UserData //& Record<never,never>

export type UserData = {
  id: UserId
  providerId: ProviderId
  created: string
  // displayName: string
  // avatarUrl?: string
}

export type Users = Record<UserId, User>
