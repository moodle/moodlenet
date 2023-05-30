import type { GraphNodeIdentifierAuth } from '../v2.mjs'

export type ActiveUser = UserBase<'Active'> & {
  authId: GraphNodeIdentifierAuth
  password: string
}
type UserBase<S extends Status> = {
  id: UserId
  status: S
  email: Email
  createdAt: number
  updatedAt: number
}
export type Status = 'Active' | 'WaitingFirstActivation'
export type Email = string
export type UserId = string
