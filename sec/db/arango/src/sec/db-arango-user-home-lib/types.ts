import { userHomeRecord } from '@moodle/module/user-home'
import { id_to_key } from '../../types'

export type userHomeDocument = id_to_key<userHomeRecord>
