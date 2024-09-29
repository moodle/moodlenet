import { _unchecked_brand } from '@moodle/lib-types'
import { user_record } from '@moodle/mod-iam/types'
import { Document } from 'arangojs/documents'
import { userDocument } from './types'

export function userDocument2user_record(doc: Document<userDocument>): user_record {
  return _unchecked_brand<user_record>({
    id: doc._key,
    createdAt: doc.createdAt,
    roles: doc.roles,
    activityStatus: doc.activityStatus,
    contacts: doc.contacts,
    deactivated: doc.deactivated,
    displayName: doc.displayName,
    passwordHash: doc.passwordHash,
  })
}

export function user_record2userDocument(
  user_record: user_record,
): Omit<Document<userDocument>, '_id' | '_rev'> {
  return _unchecked_brand<userDocument>({
    _key: user_record.id,
    createdAt: user_record.createdAt,
    roles: user_record.roles,
    activityStatus: user_record.activityStatus,
    contacts: user_record.contacts,
    deactivated: user_record.deactivated,
    displayName: user_record.displayName,
    passwordHash: user_record.passwordHash,
  })
}
