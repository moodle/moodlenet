import { userAccountRecord } from '@moodle/module/user-account'
import { id_to_key, key_to_id } from '../../lib/mapping'
import { userAccountDocument } from './user-account-types'

export const userAccountDocument2userAccountRecord = key_to_id<userAccountDocument>
export const userAccountRecord2userAccountDocument = id_to_key<userAccountRecord>
