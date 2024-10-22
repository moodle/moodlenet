import { generateNanoId } from '@moodle/lib-id-gen'
import {
  _unchecked_brand,
  date_time_string,
  email_address,
  named_email_address,
  non_negative_integer_brand,
  non_negative_integer_schema,
} from '@moodle/lib-types'
import { userRecord, user_role } from '../types'
import { password_hash } from '../../crypto/types'

export interface CreateNewUserRecordDataArg {
  displayName: string
  email: email_address
  passwordHash: password_hash
  createdAt?: date_time_string
  lastLogin?: date_time_string
  roles?: user_role[]
}

export async function createNewUserRecordData({
  displayName,
  email,
  passwordHash,
  roles = [],
  createdAt,
  lastLogin,
}: CreateNewUserRecordDataArg): Promise<userRecord> {
  const now = date_time_string('now')
  const id = await generateNanoId()
  return {
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
    moodlenet: {
      moderation: { reports: { amount: non_negative_integer_schema.parse(0), items: [] } },
    },
  }
}
