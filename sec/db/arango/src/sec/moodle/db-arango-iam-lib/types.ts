import { branded } from '@moodle/lib-types'
import { userRecord } from '@moodle/mod-iam/v1_0/types'

export const user_document_brand= Symbol('user_document')
export type userDocument = /* branded< */Omit<userRecord, 'id'>/* , typeof user_document_brand> */
