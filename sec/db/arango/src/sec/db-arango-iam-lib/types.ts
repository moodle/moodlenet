import { iam } from '@moodle/domain'
import { branded } from '@moodle/lib-types'
import { id_to_key } from '../../types'

// export const user_document_brand = Symbol('user_document')
declare const user_document_brand: unique symbol
export type userDocument = branded<id_to_key<iam.user_record>, typeof user_document_brand>
