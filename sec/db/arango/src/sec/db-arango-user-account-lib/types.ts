import { userRecord } from '@moodle/module/user-account'
import { id_to_key } from '../../types'

export type userDocument = id_to_key<userRecord>
