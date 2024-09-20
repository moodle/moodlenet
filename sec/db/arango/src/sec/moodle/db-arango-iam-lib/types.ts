import { DbUser } from '@moodle/mod-iam/v1_0/types'

export type IamUserDocument = Omit<DbUser, 'id'>
