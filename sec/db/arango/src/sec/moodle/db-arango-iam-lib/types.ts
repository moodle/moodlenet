import { v1_0 as iam_v1_0 } from '@moodle/mod-iam'
export type IamUserDocument = Omit<iam_v1_0.DbUser, 'id'>
