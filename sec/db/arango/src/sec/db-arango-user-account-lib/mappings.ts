import { userRecord } from '@moodle/module/user-account'
import { id_to_key, key_to_id } from '../../lib/mapping'
import { userDocument } from './types'

export function userDocument2userRecord(doc: userDocument): userRecord {
  return key_to_id(doc)
}

export function userRecord2userDocument(userRecord: userRecord): userDocument {
  return id_to_key(userRecord)
}
