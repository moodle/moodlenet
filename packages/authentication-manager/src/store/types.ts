import { ExtName } from '@moodlenet/core'

export type UserId = string
export type User = {
  id: UserId
  displayName: string
  provider: {
    ext: ExtName
    id: string
  }
  created: string
}

export type Users = Record<UserId, User>
