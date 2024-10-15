import { branded } from '@moodle/lib-types'
import { user_record } from '@moodle/module/iam'
import { id_to_key } from '../../types'

declare const user_document_brand: unique symbol
export type userDocument = branded<id_to_key<user_record>, typeof user_document_brand>
