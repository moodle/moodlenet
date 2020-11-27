export type CreatedDocumentBase = {
  createdAt: number
}
export type UpdatedDocumentBase = {
  updatedAt: number
}

export type MutableDocumentBase = CreatedDocumentBase & UpdatedDocumentBase

export type Maybe<T> = T | null | undefined
