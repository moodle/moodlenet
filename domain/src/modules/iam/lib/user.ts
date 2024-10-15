import { generateNanoId } from '@moodle/lib-id-gen'
import { _unchecked_brand, date_time_string, email_address, named_email_address } from '@moodle/lib-types'
import { user_password_hash, user_record, user_role } from '../types'

export function getUserNamedEmailAddress({ contacts, displayName }: Pick<user_record, 'contacts' | 'displayName'>): named_email_address {
  return {
    address: contacts.email,
    name: displayName,
  }
}

export interface CreateNewUserRecordDataArg {
  displayName: string
  email: email_address
  passwordHash: user_password_hash
  createdAt?: date_time_string
  lastLogin?: date_time_string
  roles?: user_role[]
}

export async function createNewUserRecordData({ displayName, email, passwordHash, roles = [], createdAt, lastLogin }: CreateNewUserRecordDataArg): Promise<user_record> {
  const now = date_time_string('now')
  const id = await generateNanoId()
  return _unchecked_brand<user_record>({
    id,
    createdAt: createdAt ?? now,
    roles: roles,
    displayName,
    contacts: {
      email,
    },
    passwordHash,
    activityStatus: {
      lastLogin: lastLogin ?? now,
    },
    deactivated: false,
  })
}
