import { userAccountRecord } from '@moodle/module/user-account'
import { id_to_key, key_to_id } from '../../lib/mapping'
import { userAccountDocument } from './types'

export function userAccountDocument2userAccountRecord(doc: userAccountDocument): userAccountRecord {
  return key_to_id(doc)
}

export function userAccountRecord2userAccountDocument(userAccountRecord: userAccountRecord): userAccountDocument {
  return id_to_key(userAccountRecord)
}
