import { userProfileRecord } from '@moodle/module/user-profile'
import { id_to_key, key_to_id } from '../../lib/mapping'
import { userProfileDocument } from './user-profile-types'

export const userProfileDocument2userProfileRecord = key_to_id<userProfileDocument>
export const userProfileRecord2userProfileDocument = id_to_key<userProfileRecord>

// export function userProfileDocument2user_profile_record(doc: userProfileDocument): userProfileRecord {  return key_to_id(doc)}
// export function user_profile_record2userProfileDocument(user_profile_record: userProfileRecord): userProfileDocument {  return id_to_key(user_profile_record)}
