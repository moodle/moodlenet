import { ExtName } from '@moodlenet/core'

export type UserId = string

export type ProviderId = {
  ext: ExtName
  uid: string
}

export type User = UserData & {}

export type UserData = {
  id: UserId
  displayName: string
  providerId: ProviderId
  created: string
}

export type Users = Record<UserId, User>
