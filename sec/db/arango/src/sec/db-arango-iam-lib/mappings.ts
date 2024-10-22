import { _unchecked_brand } from '@moodle/lib-types'
import { userRecord } from '@moodle/module/iam'
import { userDocument } from './types'
import { id_to_key, key_to_id } from '../../lib/mapping'

export function userDocument2userRecord(doc: userDocument): userRecord {
  return key_to_id(doc)
}

export function userRecord2userDocument(userRecord: userRecord): userDocument {
  return id_to_key(userRecord)
}
