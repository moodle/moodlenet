import { date_time_string } from '@moodle/lib-types'

export type authSession = { session: moo.session.user; createdDate: date_time_string; validUntilDate: date_time_string }
