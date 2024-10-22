import { userHomeRecord } from '@moodle/module/user-home'
import { Document } from 'arangojs/documents'
import { userHomeDocument } from './types'

export function userHomeDocument2user_home_record(doc: userHomeDocument): userHomeRecord {
  return {
    id: doc._key,
    profileInfo: doc.profileInfo,
    iamUser: {
      id: doc.iamUser.id,
      roles: doc.iamUser.roles,
    },
  }
}

export function user_home_record2userHomeDocument(
  user_home_record: userHomeRecord,
): Omit<Document<userHomeDocument>, '_id' | '_rev'> {
  return {
    _key: user_home_record.id,
    profileInfo: user_home_record.profileInfo,
    iamUser: user_home_record.iamUser,
  }
}
