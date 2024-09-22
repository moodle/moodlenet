import { _unchecked_brand } from '@moodle/lib-types'
import { userRecord } from '@moodle/mod-iam/v1_0/types'
import { Document } from 'arangojs/documents'
import { userDocument } from './types'

export function iamUserDoc2userRecord(doc: Document<userDocument>): userRecord {
  return _unchecked_brand<userRecord>({
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

export function userRecord2iamUserDoc(
  userRecord: userRecord,
): Omit<Document<userDocument>, '_id' | '_rev'> {
  return {
    _key: userRecord.id,
    createdAt: userRecord.createdAt,
    roles: userRecord.roles,
    activityStatus: userRecord.activityStatus,
    contacts: userRecord.contacts,
    deactivated: userRecord.deactivated,
    displayName: userRecord.displayName,
    passwordHash: userRecord.passwordHash,
  }
}
