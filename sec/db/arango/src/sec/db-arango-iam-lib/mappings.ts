import { _unchecked_brand } from '@moodle/lib-types'
import { userRecord } from '@moodle/module/iam'
import { Document } from 'arangojs/documents'
import { userDocument } from './types'

export function userDocument2userRecord(doc: userDocument): userRecord {
  return {
    id: doc._key,
    createdAt: doc.createdAt,
    roles: doc.roles,
    activityStatus: doc.activityStatus,
    contacts: doc.contacts,
    deactivated: doc.deactivated,
    displayName: doc.displayName,
    passwordHash: doc.passwordHash,
  }
}

export function userRecord2userDocument(userRecord: userRecord): Omit<Document<userDocument>, '_id' | '_rev'> {
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
