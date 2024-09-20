import { generateId, id_type } from '@moodle/lib-id-gen'
import { date_time_string, email_address } from '@moodle/lib-types'
import { DbUser, user_password_hash, user_role, UserData } from '../types'

export function dbUser2UserData(dbUser: Pick<DbUser, keyof UserData>): UserData {
  return {
    id: dbUser.id,
    createdAt: dbUser.createdAt,
    contacts: dbUser.contacts,
    displayName: dbUser.displayName,
    roles: dbUser.roles,
  }
}

export interface CreateNewDbUserDataArg {
  displayName: string
  email: email_address
  passwordHash: user_password_hash
  createdAt?: date_time_string
  lastLogin?: date_time_string
  roles?: user_role[]
  idType?: id_type
}

export async function createNewDbUserData({
  displayName,
  email,
  passwordHash,
  roles = [],
  createdAt,
  lastLogin,
  idType,
}: CreateNewDbUserDataArg): Promise<DbUser> {
  const now = date_time_string('now')
  const id = await generateId(
    idType ?? {
      type: 'alphanumeric',
      length: 8,
    },
  )
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
      inactiveNotificationSentAt: false,
    },
    deactivated: false,
  }
}
