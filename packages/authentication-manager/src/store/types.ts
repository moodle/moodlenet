import { ExtName } from '@moodlenet/core'

export type UserId = string

export type ProviderId = {
  ext: ExtName
  uid: string
}

export type User = {
  id: UserId
  displayName: string
  providerId: ProviderId
  created: string
}

export type Users = Record<UserId, User>
