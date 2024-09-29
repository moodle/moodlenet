import { generateId, id_type } from '@moodle/lib-id-gen'
import {
  date_time_string,
  email_address,
  named_email_address,
  _unchecked_brand,
} from '@moodle/lib-types'
import { user_password_hash, user_role, user_record } from '../types'

export function getUserNamedEmailAddress({
  contacts,
  displayName,
}: Pick<user_record, 'contacts' | 'displayName'>): named_email_address {
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
  idType?: id_type
}

export async function createNewUserRecordData({
  displayName,
  email,
  passwordHash,
  roles = [],
  createdAt,
  lastLogin,
  idType,
}: CreateNewUserRecordDataArg): Promise<user_record> {
  const now = date_time_string('now')
  const id = await generateId(
    idType ?? {
      type: 'alphanumeric',
      length: 8,
    },
  )
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
      inactiveNotificationSentAt: false,
    },
    deactivated: false,
  })
}
