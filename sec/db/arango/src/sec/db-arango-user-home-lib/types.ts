import { branded } from '@moodle/lib-types'
import { user_home_record } from '@moodle/module/user-home'
import { id_to_key } from '../../types'

declare const user_home_document_brand: unique symbol
export type userHomeDocument = branded<id_to_key<user_home_record>, typeof user_home_document_brand>
