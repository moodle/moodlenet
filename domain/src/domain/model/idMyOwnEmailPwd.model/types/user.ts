import { email_address } from '@moodle/lib-types'
import { userHomeRecord } from '../../userHome.model'

export type idMyOwnEmailPwdRecord = Pick<userHomeRecord, 'userId'> & idMyOwnEmailPwdEntry

export type idMyOwnEmailPwdEntry = {
  email: { address: email_address }
  password: { hash: string }
}
