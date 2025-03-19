import { email_address } from '@moodle/lib-types'
import { userHomeRecord } from '../../userHome.model'

export type idConfirmedEmailRecord = Pick<userHomeRecord, 'userId'> & idConfirmedEmailEntry

export type idConfirmedEmailEntry = {
  email: { address: email_address }
  password: { hash: string }
}
