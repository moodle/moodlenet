import { _unchecked_brand } from '@moodle/lib-types'
import { user_home_record } from '@moodle/module/user-home'
import { Document } from 'arangojs/documents'
import { userHomeDocument } from './types'

export function userHomeDocument2user_home_record(doc: userHomeDocument): user_home_record {
  return _unchecked_brand<user_home_record>({
    id: doc._key,
    profileInfo: doc.profileInfo,
    user: {
      id: doc.user.id,
      roles: doc.user.roles,
    },
  })
}

export function user_home_record2userHomeDocument(user_home_record: user_home_record): Omit<Document<userHomeDocument>, '_id' | '_rev'> {
  return _unchecked_brand<userHomeDocument>({
    _key: user_home_record.id,
    profileInfo: user_home_record.profileInfo,
    user: user_home_record.user,
  })
}
