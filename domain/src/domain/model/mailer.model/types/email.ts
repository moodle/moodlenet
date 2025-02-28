import { email_address } from '@moodle/lib-types'

export type emailBody = unknown
export type emailEnvelope = {
  subject: string
  to: email_address[]
  body: emailBody
  // from: email_address
}
