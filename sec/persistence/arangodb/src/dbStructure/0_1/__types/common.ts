import { d_u } from '@moodle/lib/types'
import { Document } from 'arangojs/documents'
import { FileMeta } from './data/file-server'

export function withRevision<T extends object>(
  doc: T | WithRevision<T>,
  revisionDate: string | Date,
): WithRevision<T> {
  const revisionNowDate = revisionDate instanceof Date ? revisionDate : new Date(revisionDate)
  const revisionNowISO = revisionNowDate.toISOString()
  const updated = revisionNowISO
  const created = '_revision' in doc ? doc._revision.created : revisionNowISO
  return { ...doc, _revision: { created, updated } }
}

export type Doc<T> = Document<T>
export type DocWithRevision<T> = Doc<WithRevision<T>>
export type WithRevision<T> = T & { _revision: { created: dateTime; updated: dateTime } }

export type dateTime = string // time in ISO 8601 format

export type DBRef<T> = string & { [t in symbol]?: T }
export type Email = string

export type Url = string
export type asset = d_u<{ link: Url; file: FileMeta }, '_assetType'>
