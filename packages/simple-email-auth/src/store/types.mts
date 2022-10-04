export type UserId = string
export type Email = string
export type Password = string

export type User = {
  id: UserId
  email: Email
  password: Password
  created: string
}

export type Users = Record<UserId, User>
