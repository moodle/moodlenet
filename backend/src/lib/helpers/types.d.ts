export type CreatedDocumentBase = {
  createdAt: Date
}
export type UpdatedDocumentBase = {
  updatedAt: Date
}

export type MutableDocumentBase = CreatedDocumentBase & UpdatedDocumentBase

export type Maybe<T> = T | null | undefined
