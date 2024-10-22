import { userProfileRecord } from '@moodle/module/user-profile'
import { Document } from 'arangojs/documents'
import { userProfileDocument } from './types'

export function userProfileDocument2user_profile_record(doc: userProfileDocument): userProfileRecord {
  return {
    id: doc._key,
    profileInfo: doc.profileInfo,
    iamUser: {
      id: doc.iamUser.id,
      roles: doc.iamUser.roles,
    },
  }
}

export function user_profile_record2userProfileDocument(
  user_profile_record: userProfileRecord,
): Omit<Document<userProfileDocument>, '_id' | '_rev'> {
  return {
    _key: user_profile_record.id,
    profileInfo: user_profile_record.profileInfo,
    iamUser: user_profile_record.iamUser,
  }
}
