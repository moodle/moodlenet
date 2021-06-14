export type WithCreated = {
  createdAt: number
}
export type WithUpdated = {
  updatedAt: number
}

export type WithId = { _id: string }
export type WithMutable = WithCreated & WithUpdated

export type Maybe<T> = T | null
