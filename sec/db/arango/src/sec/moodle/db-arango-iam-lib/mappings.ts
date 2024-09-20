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

export function dbUser2iamUserDoc(dbUser: DbUser): Omit<Document<IamUserDocument>, '_id' | '_rev'> {
  return {
    _key: dbUser.id,
    createdAt: dbUser.createdAt,
    roles: dbUser.roles,
    activityStatus: dbUser.activityStatus,
    contacts: dbUser.contacts,
    deactivated: dbUser.deactivated,
    displayName: dbUser.displayName,
    passwordHash: dbUser.passwordHash,
  }
}
