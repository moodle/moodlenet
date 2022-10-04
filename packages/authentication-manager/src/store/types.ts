import { ExtName } from '@moodlenet/core'

export type UserId = string

export type ProviderId = {
  ext: ExtName
  uid: string
}

export type User = UserData & {}

export type UserData = {
  id: UserId
  providerId: ProviderId
  created: string
  // displayName: string
  // avatarUrl?: string
}

export type Users = Record<UserId, User>
