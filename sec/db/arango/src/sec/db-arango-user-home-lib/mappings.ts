import { userHome } from '@moodle/domain'
import { _unchecked_brand } from '@moodle/lib-types'
import { Document } from 'arangojs/documents'
import { userHomeDocument } from './types'

export function userHomeDocument2user_home_record(
  doc: userHomeDocument,
): userHome.user_home_record {
  return _unchecked_brand<userHome.user_home_record>({
    id: doc._key,
    profileInfo: doc.profileInfo,
    userId: doc.userId,
  })
}

export function user_home_record2userHomeDocument(
  user_home_record: userHome.user_home_record,
): Omit<Document<userHomeDocument>, '_id' | '_rev'> {
  return _unchecked_brand<userHomeDocument>({
    _key: user_home_record.id,
    profileInfo: user_home_record.profileInfo,
    userId: user_home_record.userId,
  })
}
