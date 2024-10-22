import { userRecord } from '@moodle/module/iam'
import { id_to_key } from '../../types'

export type userDocument = id_to_key<userRecord>
