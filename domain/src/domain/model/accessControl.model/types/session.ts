import { date_time_string } from '@moodle/lib-types'
import { userId } from '../../userAccount.model'

export type authSession = { userId: userId; session: moo.session.user; createdDate: date_time_string; validUntilDate: date_time_string }
