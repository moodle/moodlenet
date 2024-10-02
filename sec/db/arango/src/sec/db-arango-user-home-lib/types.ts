import { userHome } from '@moodle/domain'
import { branded } from '@moodle/lib-types'
import { id_to_key } from '../../types'

declare const user_home_document_brand: unique symbol
export type userHomeDocument = branded<
  id_to_key<userHome.user_home_record>,
  typeof user_home_document_brand
>
