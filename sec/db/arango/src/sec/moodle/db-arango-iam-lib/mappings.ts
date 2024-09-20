import { DbUser } from '@moodle/mod-iam/v1_0/types'
import { Document } from 'arangojs/documents'
import { IamUserDocument } from './types'

export function iamUserDoc2dbUser(doc: Document<IamUserDocument>): DbUser {
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
