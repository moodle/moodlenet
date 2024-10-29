import { _any, _nullish, pretty } from '@moodle/lib-types'
import { aql } from 'arangojs'

declare const DOC_RECORD_BRAND: unique symbol
export type record_doc<record extends { id: string }> = pretty<
  Omit<record, 'id'> & { [_ in typeof DOC_RECORD_BRAND]?: record }
>
export function save_id_to_key<record extends { id: string }>(
  record: record,
): pretty<Omit<record, 'id'> & { _key: string }> {
  return {
    _key: record.id,
    ...record,
    id: undefined,
  }
}
export function restore_maybe_record<doc extends record_doc<_any>>(m_doc: _nullish | doc) {
  if (!m_doc) {
    return
  }
  return restore_record(m_doc)
}
export function restore_record<doc extends record_doc<_any>>(
  doc: doc,
): doc extends record_doc<infer record> ? record : never {
  const clean_doc: _any = Object.fromEntries(Object.entries(doc).filter(([prop]) => !prop.startsWith('_')))
  return {
    ...clean_doc,
    id: doc._key,
  }
}

// export function RESTORE_RECORD_AQL(varName: string) {
//   return aql`MERGE( { id: ${varName}._key }, UNSET( ${varName}, "_id", "_rev", "_key" ) )`
// }
