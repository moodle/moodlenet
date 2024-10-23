import { userAccountRecord } from '@moodle/module/user-account'
import { id_to_key } from '../../types'

export type userAccountDocument = id_to_key<userAccountRecord>
