import { named_email_address } from '@moodle/lib-types'
import { UserData } from './types'

export function getUserNamedEmailAddress({
  contacts,
  displayName,
}: Pick<UserData, 'contacts' | 'displayName'>): named_email_address {
  return {
    address: contacts.email,
    name: displayName,
  }
}
