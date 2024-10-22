import { userProfileRecord } from '@moodle/module/user-profile'
import { id_to_key } from '../../types'

export type userProfileDocument = id_to_key<userProfileRecord>
