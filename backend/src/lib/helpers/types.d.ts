import { Flow } from '../domain/types/path'

export type WithCreated = {
  createdAt: number
}
export type WithUpdated = {
  updatedAt: number
}

export type WithId = { _id: string }
export type WithFlow = { _flow: Flow }
export type WithMutable = WithCreated & WithUpdated

export type Maybe<T> = T | null | undefined
