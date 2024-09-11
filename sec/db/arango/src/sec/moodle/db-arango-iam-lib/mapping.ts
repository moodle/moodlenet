import type { v0_1 as iam_v0_1 } from '@moodle/mod-iam'
import { Document } from 'arangojs/documents'

export function dbUserDoc2DbUser(doc: Document<iam_v0_1.DbUser>): iam_v0_1.DbUser {
  return {
    activityStatus: doc.activityStatus,
    contacts: doc.contacts,
    deactivated: doc.deactivated,
    displayName: doc.displayName,
    passwordHash: doc.passwordHash,
    roles: doc.roles,
    id: doc._key,
  }
}
