import type { v1_0 as iam_v1_0 } from '@moodle/mod-iam'
import { Document } from 'arangojs/documents'
import { IamUserDocument } from './types'

export function iamUserDoc2dbUser(doc: Document<IamUserDocument>): iam_v1_0.DbUser {
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
