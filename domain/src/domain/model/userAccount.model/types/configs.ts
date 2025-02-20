import { eduCollectionSchemaConfigsOverrides, eduResourceSchemaConfigsOverrides } from '../../education.model'

export type eduDraftsSchemaOverrides = {
  collection: eduCollectionSchemaConfigsOverrides
  resource: eduResourceSchemaConfigsOverrides
}
export type configs = {
  schema: {
    eduDraftsOverrides: eduDraftsSchemaOverrides
  }
}
