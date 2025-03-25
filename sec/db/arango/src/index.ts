import { any_ } from '@moodle/lib-types'
import { Document, DocumentSelector } from 'arangojs/documents'

export { DocumentCollection } from 'arangojs/collection'
export * from './arangodb-persistence'
export * from './env-provider'
export * from './services'

declare module 'arangojs/collection' {
  //@ts-expect-error despite it's a bad hack, it helps avoiding unchecked nulls when document(_key, {graceful: true})
  interface DocumentCollection<EntryResultType extends Record<string, any_> = any_, _EntryInputType extends Record<string, any_> = EntryResultType> {
    document<o extends CollectionReadOptions>(selector: DocumentSelector, options?: o): Promise<(o extends { graceful: true } ? null : never) | Document<EntryResultType>>
  }
}
